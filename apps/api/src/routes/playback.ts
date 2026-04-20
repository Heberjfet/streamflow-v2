import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { S3Service } from '../services/s3.service.js';

interface PlaybackParams {
  playbackId: string;
}

export async function playbackRoutes(fastify: FastifyInstance) {
  const s3Service = new S3Service(fastify.s3, fastify.s3Config);

  fastify.get<{ Params: PlaybackParams }>('/:playbackId', async (request, reply) => {
    try {
      const { playbackId } = request.params;

      const asset = await fastify.db.query.assets.findFirst({
        where: (assets: any, { eq }: any) => eq(assets.playbackId, playbackId)
      });

      if (!asset) {
        return reply.status(404).send({ error: 'Asset not found' });
      }

      if (asset.status !== 'ready') {
        return reply.status(400).send({ error: 'Asset not ready for playback' });
      }

      const manifestUrl = s3Service.getPublicUrl(s3Service.getHlsPath(playbackId));
      const thumbnailUrl = asset.thumbnailUrl || s3Service.getPublicUrl(s3Service.getThumbnailPath(asset.id));

      return reply.send({
        manifestUrl,
        thumbnailUrl,
        title: asset.title,
        duration: asset.duration
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
