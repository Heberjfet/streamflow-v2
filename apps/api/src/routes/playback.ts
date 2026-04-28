import { FastifyInstance } from 'fastify';
import { S3Service } from '../services/s3.service.js';
import { ANALYTICS_EVENT_TYPES, REACTION_EMOJIS } from '../db/schema.js';

interface PlaybackParams {
  playbackId: string;
}

interface EventBody {
  eventType: string;
  sessionId: string;
  currentTime?: number;
  duration?: number;
  qualityHeight?: number;
  referrer?: string;
  playerType?: string;
  bufferDurationMs?: number;
  errorMessage?: string;
}

interface ReactionBody {
  emoji: string;
  sessionId: string;
}

export async function playbackRoutes(fastify: FastifyInstance) {
  const s3Service = new S3Service(fastify.s3, fastify.s3Config);

  fastify.get<{ Params: PlaybackParams }>('/:playbackId', async (request, reply) => {
    try {
      const { playbackId } = request.params;

      const [asset] = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.playbackId, playbackId)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      if (asset.status !== 'ready') {
        return reply.status(400).send({ error: 'Asset not ready for playback' });
      }

      const manifestUrl = s3Service.getPublicUrl(asset.hlsManifestKey || '');
      const thumbnailUrl = asset.thumbnailKey
        ? s3Service.getPublicUrl(asset.thumbnailKey)
        : null;

      const publicSettings = (asset.publicSettings as { allowDownload?: boolean; showComments?: boolean; showReactions?: boolean }) || {};

      return reply.send({
        manifestUrl,
        thumbnailUrl,
        title: asset.title,
        description: asset.description,
        duration: asset.duration,
        playbackId,
        allowDownload: publicSettings.allowDownload ?? false,
        showComments: publicSettings.showComments ?? true,
        showReactions: publicSettings.showReactions ?? true
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Params: PlaybackParams; Body: EventBody }>('/:playbackId/events', async (request, reply) => {
    try {
      const { playbackId } = request.params;
      const { eventType, sessionId, currentTime, duration, qualityHeight, referrer, playerType, bufferDurationMs, errorMessage } = request.body;

      if (!Object.values(ANALYTICS_EVENT_TYPES).includes(eventType as any)) {
        return reply.status(400).send({ error: 'Invalid event type' });
      }

      const [asset] = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.playbackId, playbackId)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      await fastify.db
        .insert(fastify.schema.analyticsEvents)
        .values({
          orgId: asset.orgId || undefined,
          assetId: asset.id,
          playbackId,
          sessionId,
          eventType,
          currentTime,
          duration,
          qualityHeight,
          referrer,
          playerType,
          bufferDurationMs,
          errorMessage
        });

      if (eventType === ANALYTICS_EVENT_TYPES.VIEW_START) {
        await fastify.db
          .update(fastify.schema.assets)
          .set({ views: (asset.views || 0) + 1 })
          .where(fastify.eq(fastify.schema.assets.id, asset.id));
      }

      return reply.send({ success: true });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get<{ Params: PlaybackParams }>('/:playbackId/comments', async (request, reply) => {
    try {
      const { playbackId } = request.params;
      const limit = parseInt((request.query as any).limit || '50');
      const offset = parseInt((request.query as any).offset || '0');

      const [asset] = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.playbackId, playbackId)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      const comments = await fastify.db.query.comments.findMany({
        where: (comments, { eq }) => eq(comments.assetId, asset.id),
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

  fastify.post<{ Params: PlaybackParams; Body: { content: string; timestamp?: number; authorName?: string; authorEmail?: string } }>('/:playbackId/comments', async (request, reply) => {
    try {
      const { playbackId } = request.params;
      const { content, timestamp, authorName, authorEmail } = request.body;

      if (!content || content.trim().length === 0) {
        return reply.status(400).send({ error: 'Comment content is required' });
      }

      const [asset] = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.playbackId, playbackId)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      let gravatarHash: string | undefined;
      if (authorEmail) {
        const crypto = await import('crypto');
        gravatarHash = crypto.createHash('md5').update(authorEmail.toLowerCase().trim()).digest('hex');
      }

      const [comment] = await fastify.db
        .insert(fastify.schema.comments)
        .values({
          assetId: asset.id,
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

  fastify.get<{ Params: PlaybackParams }>('/:playbackId/reactions', async (request, reply) => {
    try {
      const { playbackId } = request.params;
      const sessionId = (request.headers['x-session-id'] as string) || (request.query as any).sessionId;

      const [asset] = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.playbackId, playbackId)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      const reactions = await fastify.db.query.reactions.findMany({
        where: (reactions, { eq }) => eq(reactions.assetId, asset.id)
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

  fastify.post<{ Params: PlaybackParams; Body: ReactionBody }>('/:playbackId/reactions', async (request, reply) => {
    try {
      const { playbackId } = request.params;
      const { emoji, sessionId } = request.body;

      if (!REACTION_EMOJIS.includes(emoji as any)) {
        return reply.status(400).send({ error: 'Invalid emoji' });
      }

      if (!sessionId) {
        return reply.status(400).send({ error: 'Session ID is required' });
      }

      const [asset] = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.playbackId, playbackId)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      const [existing] = await fastify.db.query.reactions.findMany({
        where: (reactions, { and, eq }) => and(
          eq(reactions.assetId, asset.id),
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
          assetId: asset.id,
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

  fastify.get<{ Params: PlaybackParams }>('/:playbackId/download', async (request, reply) => {
    try {
      const { playbackId } = request.params;
      const quality = (request.query as any).quality;

      const [asset] = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.playbackId, playbackId)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      const publicSettings = (asset.publicSettings as { allowDownload?: boolean }) || {};
      if (!publicSettings.allowDownload) {
        return reply.status(403).send({ error: 'Download not allowed' });
      }

      if (quality && quality !== 'original') {
        const downloadKey = `assets/${asset.id}/hls/${quality}/download.mp4`;
        const url = await s3Service.getPresignedUrl(downloadKey);
        return reply.redirect(url);
      }

      if (asset.sourceKey) {
        const url = await s3Service.getPresignedUrl(asset.sourceKey);
        return reply.redirect(url);
      }

      return reply.status(404).send({ error: 'Original file not available' });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}