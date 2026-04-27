import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PutObjectCommand, UploadPartCommand } from '@aws-sdk/client-s3';
import { PassThrough } from 'stream';
import { S3Service } from '../services/s3.service.js';
import { AssetService } from '../services/asset.service.js';

interface ListQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
}

interface CreateBody {
  title: string;
  description?: string;
  categoryId?: string;
}

interface UploadUrlBody {
  filename: string;
  contentType: string;
}

interface AssetParams {
  id: string
}

interface UploadBody {
  filename: string;
  contentType: string;
}

export async function assetRoutes(fastify: FastifyInstance) {
  const s3Service = new S3Service(fastify.s3, fastify.s3Config);
  const assetService = new AssetService(s3Service, fastify.transcodeQueue);
  const generateUploadUrl = fastify.generateUploadUrl;

  fastify.get<{ Querystring: ListQuery }>('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const page = request.query.page || 1;
      const limit = request.query.limit || 20;
      const offset = (page - 1) * limit;

      const assets = await fastify.db.query.assets.findMany({
        where: fastify.eq(fastify.schema.assets.userId, request.currentUser.userId),
        limit,
        offset,
        orderBy: [fastify.desc(fastify.schema.assets.createdAt)]
      });

      return reply.send({
        data: assets,
        page,
        limit
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Body: CreateBody }>('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { title, description, categoryId } = request.body;
      const playbackId = assetService.generatePlaybackId();

      const [asset] = await fastify.db
        .insert(fastify.schema.assets)
        .values({
          title,
          description,
          categoryId,
          userId: request.currentUser.userId,
          playbackId,
          status: 'pending'
        })
        .returning();

      return reply.status(201).send(asset);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get<{ Params: AssetParams }>('/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;

      const asset = await fastify.db.query.assets.findFirst({
        where: fastify.eq(fastify.schema.assets.id, id)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      if (asset.userId !== request.currentUser.userId) {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      return reply.send(asset);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Params: AssetParams; Body: { filename: string; contentType: string } }>('/:id/upload-url', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { filename, contentType } = request.body;

      const asset = await fastify.db.query.assets.findFirst({
        where: fastify.eq(fastify.schema.assets.id, id)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      if (asset.userId !== request.currentUser.userId) {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      const key = s3Service.getAssetPath(request.currentUser.userId, id, filename);
      const uploadUrl = await generateUploadUrl(key, contentType);

      return reply.send({
        uploadUrl,
        key
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Params: AssetParams }>('/:id/upload', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;

      const asset = await fastify.db.query.assets.findFirst({
        where: fastify.eq(fastify.schema.assets.id, id)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      if (asset.userId !== request.currentUser.userId) {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ error: 'No file uploaded' });
      }

      const filename = 'original';
      const key = s3Service.getAssetPath(request.currentUser.userId, id, filename);

      const buffer = await data.toBuffer();

      fastify.log.info(`Uploading ${buffer.length} bytes to S3: ${key}`);

      const command = new PutObjectCommand({
        Bucket: fastify.s3Config.bucket,
        Key: key,
        Body: buffer,
        ContentType: data.mimetype
      });

      await fastify.s3.send(command);

      return reply.send({ success: true, key });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Params: AssetParams }>('/:id/process', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;

      const asset = await fastify.db.query.assets.findFirst({
        where: fastify.eq(fastify.schema.assets.id, id)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      if (asset.userId !== request.currentUser.userId) {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      const inputKey = `uploads/${request.currentUser.userId}/${id}/original`;
      const jobId = await assetService.enqueueTranscodeJob(id, request.currentUser.userId, inputKey);

      await fastify.db
        .update(fastify.schema.assets)
        .set({ status: 'processing' })
        .where(fastify.eq(fastify.schema.assets.id, id));

      return reply.send({ jobId });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get<{ Params: AssetParams }>('/:id/playback', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;

      const asset = await fastify.db.query.assets.findFirst({
        where: fastify.eq(fastify.schema.assets.id, id)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      if (asset.userId !== request.currentUser.userId) {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      if ((asset.status !== 'ready' && asset.status !== 'completed') || !asset.playbackId) {
        return reply.status(400).send({ error: 'Asset not ready for playback' });
      }

      const manifestUrl = s3Service.getPublicUrl(asset.hlsManifestKey?.split(',')[0] || '');
      const thumbnailUrl = asset.thumbnailKey
        ? s3Service.getPublicUrl(asset.thumbnailKey)
        : null;

      return reply.send({
        manifestUrl,
        thumbnailUrl
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.delete<{ Params: AssetParams }>('/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;

      const asset = await fastify.db.query.assets.findFirst({
        where: fastify.eq(fastify.schema.assets.id, id)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      if (asset.userId !== request.currentUser.userId) {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      await fastify.db
        .delete(fastify.schema.assets)
        .where(fastify.eq(fastify.schema.assets.id, id));

      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
