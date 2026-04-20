import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
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
  id: string;
}

export async function assetRoutes(fastify: FastifyInstance) {
  const s3Service = new S3Service(fastify.s3, fastify.s3Config);
  const assetService = new AssetService(s3Service, fastify.transcodeQueue);

  fastify.get<{ Querystring: ListQuery }>('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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

  fastify.post<{ Body: CreateBody }>('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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

  fastify.get<{ Params: AssetParams }>('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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

  fastify.post<{ Params: AssetParams; Body: UploadUrlBody }>('/:id/upload-url', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
      const uploadUrl = await s3Service.generateUploadUrl(key, contentType);

      return reply.send({
        uploadUrl,
        key
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Params: AssetParams }>('/:id/process', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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

  fastify.get<{ Params: AssetParams }>('/:id/playback', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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

      if (asset.status !== 'ready' || !asset.playbackId) {
        return reply.status(400).send({ error: 'Asset not ready for playback' });
      }

      const manifestUrl = s3Service.getPublicUrl(s3Service.getHlsPath(asset.playbackId));
      const thumbnailUrl = asset.thumbnailUrl || s3Service.getPublicUrl(s3Service.getThumbnailPath(id));

      return reply.send({
        manifestUrl,
        thumbnailUrl
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.delete<{ Params: AssetParams }>('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
