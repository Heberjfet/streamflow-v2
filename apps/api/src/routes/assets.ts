import { FastifyInstance } from 'fastify';
import { PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { S3Service } from '../services/s3.service.js';
import { AssetService } from '../services/asset.service.js';
import { ASSET_STATUS, REACTION_EMOJIS, ANALYTICS_EVENT_TYPES } from '../db/schema.js';

interface ListQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  status?: string;
}

interface CreateBody {
  title: string;
  description?: string;
  categoryId?: string;
}

interface AssetParams {
  id: string
}

interface AnalyticsBody {
  eventType: string;
  playbackId: string;
  sessionId?: string;
  currentTime?: number;
  duration?: number;
  qualityHeight?: number;
  referrer?: string;
  playerType?: string;
  bufferDurationMs?: number;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

interface CommentBody {
  content: string;
  timestamp?: number;
  authorName?: string;
  authorEmail?: string;
}

interface ReactionBody {
  emoji: string;
  sessionId: string;
}

export async function assetRoutes(fastify: FastifyInstance) {
  const s3Service = new S3Service(fastify.s3, fastify.s3Config);
  const assetService = new AssetService(s3Service, fastify.transcodeQueue);

  fastify.get<{ Querystring: ListQuery }>('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const page = request.query.page || 1;
      const limit = request.query.limit || 20;
      const offset = (page - 1) * limit;

      const userId = request.currentUser!.userId;
      const assets = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.userId, userId),
        limit,
        offset,
        orderBy: [fastify.desc(fastify.schema.assets.createdAt)]
      });

      return reply.send({ data: assets, page, limit });
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
          userId: request.currentUser!.userId,
          orgId: request.orgId || undefined,
          playbackId,
          status: 'pending',
          publicSettings: {
            allowDownload: true,
            showComments: true,
            showReactions: true
          }
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
      const userId = request.currentUser!.userId;

      const [asset] = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.id, id)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      if (asset.userId !== userId) {
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
      const userId = request.currentUser!.userId;

      const [asset] = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.id, id)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      if (asset.userId !== userId) {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      const key = s3Service.getAssetPath(userId, id, filename);
      const command = new PutObjectCommand({
        Bucket: fastify.s3Config.bucket,
        Key: key,
        ContentType: contentType
      });

      const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
      const uploadUrl = await getSignedUrl(fastify.s3, command, { expiresIn: 3600 });

      await fastify.db
        .update(fastify.schema.assets)
        .set({ sourceKey: key, status: ASSET_STATUS.UPLOADING })
        .where(fastify.eq(fastify.schema.assets.id, id));

      return reply.send({
        uploadUrl,
        key,
        method: 'PUT'
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Params: AssetParams }>('/:id/upload-complete', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;
      const userId = request.currentUser!.userId;

      const [asset] = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.id, id)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      if (asset.userId !== userId) {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      if (!asset.sourceKey) {
        return reply.status(400).send({ error: 'No upload pending for this asset' });
      }

      try {
        await fastify.s3.send(new HeadObjectCommand({
          Bucket: fastify.s3Config.bucket,
          Key: asset.sourceKey
        }));
      } catch {
        return reply.status(400).send({ error: 'File not found in S3. Upload may have failed.' });
      }

      await fastify.db
        .update(fastify.schema.assets)
        .set({ status: ASSET_STATUS.UPLOADED })
        .where(fastify.eq(fastify.schema.assets.id, id));

      return reply.send({ success: true, verified: true });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Params: AssetParams }>('/:id/upload', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;
      const userId = request.currentUser!.userId;

      const [asset] = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.id, id)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      if (asset.userId !== userId) {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ error: 'No file uploaded' });
      }

      const filename = 'original';
      const key = s3Service.getAssetPath(userId, id, filename);

      const buffer = await data.toBuffer();

      fastify.log.info(`Uploading ${buffer.length} bytes to S3: ${key}`);

      const command = new PutObjectCommand({
        Bucket: fastify.s3Config.bucket,
        Key: key,
        Body: buffer,
        ContentType: data.mimetype
      });

      await fastify.s3.send(command);

      await fastify.db
        .update(fastify.schema.assets)
        .set({ sourceKey: key, status: ASSET_STATUS.UPLOADED })
        .where(fastify.eq(fastify.schema.assets.id, id));

      return reply.send({ success: true, key });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Params: AssetParams }>('/:id/process', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;
      const userId = request.currentUser!.userId;

      const [asset] = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.id, id)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      if (asset.userId !== userId) {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      const inputKey = asset.sourceKey || `uploads/${userId}/${id}/original`;
      const jobId = await assetService.enqueueTranscodeJob(id, userId, inputKey);

      await fastify.db
        .update(fastify.schema.assets)
        .set({ status: ASSET_STATUS.PROCESSING })
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
      const userId = request.currentUser!.userId;

      const [asset] = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.id, id)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      if (asset.userId !== userId) {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      if (asset.status !== ASSET_STATUS.READY || !asset.playbackId) {
        return reply.status(400).send({ error: 'Asset not ready for playback' });
      }

      const manifestUrl = s3Service.getPublicUrl(asset.hlsManifestKey || '');
      const thumbnailUrl = asset.thumbnailKey
        ? s3Service.getPublicUrl(asset.thumbnailKey)
        : null;

      const publicSettings = (asset.publicSettings as { allowDownload?: boolean }) || {};

      return reply.send({
        manifestUrl,
        thumbnailUrl,
        duration: asset.duration,
        title: asset.title,
        playbackId: asset.playbackId,
        allowDownload: publicSettings.allowDownload ?? false
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get<{ Params: AssetParams }>('/:id/comments', async (request, reply) => {
    try {
      const { id } = request.params;
      const limit = parseInt((request.query as any).limit || '50');
      const offset = parseInt((request.query as any).offset || '0');

      const comments = await fastify.db.query.comments.findMany({
        where: (comments, { eq }) => eq(comments.assetId, id),
        limit,
        offset,
        orderBy: [fastify.asc(fastify.schema.comments.createdAt)]
      });

      return reply.send({ data: comments, limit, offset });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Params: AssetParams; Body: CommentBody }>('/:id/comments', async (request, reply) => {
    try {
      const { id } = request.params;
      const { content, timestamp, authorName, authorEmail } = request.body;

      if (!content || content.trim().length === 0) {
        return reply.status(400).send({ error: 'Comment content is required' });
      }

      let gravatarHash: string | undefined;
      if (authorEmail) {
        const crypto = await import('crypto');
        gravatarHash = crypto.createHash('md5').update(authorEmail.toLowerCase().trim()).digest('hex');
      }

      const [comment] = await fastify.db
        .insert(fastify.schema.comments)
        .values({
          assetId: id,
          userId: request.currentUser?.userId,
          content: content.trim(),
          timestamp,
          authorName: authorName?.trim(),
          authorEmail: authorEmail?.trim(),
          gravatarHash
        })
        .returning();

      return reply.status(201).send(comment);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.delete<{ Params: { id: string; commentId: string } }>('/:id/comments/:commentId', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id, commentId } = request.params;
      const userId = request.currentUser!.userId;

      const [comment] = await fastify.db.query.comments.findMany({
        where: (comments, { and, eq }) => and(
          eq(comments.id, commentId),
          eq(comments.assetId, id)
        )
      });

      if (!comment) {
        return reply.status(404).send({ error: 'Comment not found' });
      }

      if (comment.userId !== userId && request.currentUser!.role !== 'admin') {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      await fastify.db
        .delete(fastify.schema.comments)
        .where(fastify.eq(fastify.schema.comments.id, commentId));

      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get<{ Params: AssetParams }>('/:id/reactions', async (request, reply) => {
    try {
      const { id } = request.params;
      const sessionId = (request.headers['x-session-id'] as string) || (request.query as any).sessionId;

      const reactions = await fastify.db.query.reactions.findMany({
        where: (reactions, { eq }) => eq(reactions.assetId, id)
      });

      const emojiCounts: Record<string, number> = {};
      for (const reaction of reactions) {
        emojiCounts[reaction.emoji] = (emojiCounts[reaction.emoji] || 0) + 1;
      }

      let userReactions: string[] = [];
      if (sessionId) {
        const userReactionsResult = reactions.filter(r => r.sessionId === sessionId);
        userReactions = userReactionsResult.map(r => r.emoji);
      }

      return reply.send({
        counts: emojiCounts,
        userReactions
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Params: AssetParams; Body: ReactionBody }>('/:id/reactions', async (request, reply) => {
    try {
      const { id } = request.params;
      const { emoji, sessionId } = request.body;

      if (!REACTION_EMOJIS.includes(emoji as any)) {
        return reply.status(400).send({ error: 'Invalid emoji' });
      }

      if (!sessionId) {
        return reply.status(400).send({ error: 'Session ID is required' });
      }

      const [existing] = await fastify.db.query.reactions.findMany({
        where: (reactions, { and, eq }) => and(
          eq(reactions.assetId, id),
          eq(reactions.sessionId, sessionId),
          eq(reactions.emoji, emoji)
        )
      });

      if (existing) {
        await fastify.db
          .delete(fastify.schema.reactions)
          .where(fastify.eq(fastify.schema.reactions.id, existing.id));

        return reply.send({ toggled: false, emoji });
      }

      const [reaction] = await fastify.db
        .insert(fastify.schema.reactions)
        .values({
          assetId: id,
          sessionId,
          emoji
        })
        .returning();

      return reply.status(201).send({ toggled: true, emoji });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.delete<{ Params: AssetParams }>('/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;
      const userId = request.currentUser!.userId;

      const [asset] = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.id, id)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      if (asset.userId !== userId && request.currentUser!.role !== 'admin') {
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