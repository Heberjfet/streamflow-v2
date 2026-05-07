import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { sql } from 'drizzle-orm';

interface StatsResponse {
  totalAssets: number;
  totalUsers: number;
  totalViews: number;
  assetsByStatus: Record<string, number>;
  recentAssets: Array<{
    id: string;
    title: string;
    status: string;
    views: number;
    createdAt: string;
  }>;
  systemInfo: {
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage: NodeJS.CpuUsage;
  };
}

export async function adminRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const decoded = await request.jwtVerify() as { userId: string; email: string; role: 'admin' | 'editor' | 'viewer'; orgId?: string; name?: string };
      request.currentUser = {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name || '',
        role: decoded.role,
        orgId: decoded.orgId
      };
    } catch (err) {
      fastify.log.error({ err }, 'JWT verify failed');
      return reply.status(401).send({ error: 'Unauthorized' });
    }
    fastify.log.info({ role: request.currentUser?.role }, 'Current user role');
    if (request.currentUser?.role !== 'admin') {
      return reply.status(403).send({ error: 'Forbidden - Admin only' });
    }
  });

  fastify.get('/stats', async (request, reply) => {
    try {
      const assetsResult = await fastify.db.execute(sql`SELECT COUNT(*) as count FROM assets`);
      const usersResult = await fastify.db.execute(sql`SELECT COUNT(*) as count FROM users`);

      const totalAssets = Number(assetsResult[0]?.count || 0);
      const totalUsers = Number(usersResult[0]?.count || 0);

      const assets = await fastify.db
        .select({
          id: fastify.schema.assets.id,
          title: fastify.schema.assets.title,
          status: fastify.schema.assets.status,
          views: fastify.schema.assets.views,
          createdAt: fastify.schema.assets.createdAt
        })
        .from(fastify.schema.assets)
        .orderBy(fastify.desc(fastify.schema.assets.createdAt))
        .limit(10);

      const assetsByStatus: Record<string, number> = {};
      for (const asset of assets) {
        assetsByStatus[asset.status] = (assetsByStatus[asset.status] || 0) + 1;
      }

      const totalViews = assets.reduce((sum, a) => sum + (a.views || 0), 0);

      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      return reply.send({
        totalAssets,
        totalUsers,
        totalViews,
        assetsByStatus,
        recentAssets: assets.map(a => ({
          id: a.id,
          title: a.title,
          status: a.status,
          views: a.views || 0,
          createdAt: a.createdAt?.toISOString() || ''
        })),
        systemInfo: {
          uptime: process.uptime(),
          memoryUsage: {
            rss: Math.round(memoryUsage.rss / 1024 / 1024),
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
            external: Math.round(memoryUsage.external / 1024 / 1024)
          },
          cpuUsage: {
            user: cpuUsage.user,
            system: cpuUsage.system
          }
        }
      } as StatsResponse);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get('/logs', async (request, reply) => {
    try {
      const limit = parseInt((request.query as any).limit || '100');

      const assets = await fastify.db
        .select({
          id: fastify.schema.assets.id,
          title: fastify.schema.assets.title,
          status: fastify.schema.assets.status,
          views: fastify.schema.assets.views,
          createdAt: fastify.schema.assets.createdAt,
          updatedAt: fastify.schema.assets.updatedAt
        })
        .from(fastify.schema.assets)
        .orderBy(fastify.desc(fastify.schema.assets.updatedAt))
        .limit(limit);

      const users = await fastify.db
        .select({
          id: fastify.schema.users.id,
          email: fastify.schema.users.email,
          name: fastify.schema.users.name,
          role: fastify.schema.users.role,
          createdAt: fastify.schema.users.createdAt
        })
        .from(fastify.schema.users)
        .orderBy(fastify.desc(fastify.schema.users.createdAt))
        .limit(limit);

      return reply.send({
        assets,
        users,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get('/health', async (request, reply) => {
    const memoryUsage = process.memoryUsage();
    return reply.send({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024)
      }
    });
  });

  fastify.get('/stream', async (request, reply) => {
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    const sendStats = async () => {
      try {
        const assetsResult = await fastify.db.execute(sql`SELECT COUNT(*) as count FROM assets`);
        const usersResult = await fastify.db.execute(sql`SELECT COUNT(*) as count FROM users`);

        const totalAssets = Number(assetsResult[0]?.count || 0);
        const totalUsers = Number(usersResult[0]?.count || 0);

        const assets = await fastify.db
          .select({
            id: fastify.schema.assets.id,
            title: fastify.schema.assets.title,
            status: fastify.schema.assets.status,
            views: fastify.schema.assets.views,
            createdAt: fastify.schema.assets.createdAt
          })
          .from(fastify.schema.assets)
          .orderBy(fastify.desc(fastify.schema.assets.createdAt))
          .limit(10);

        const assetsByStatus: Record<string, number> = {};
        for (const asset of assets) {
          assetsByStatus[asset.status] = (assetsByStatus[asset.status] || 0) + 1;
        }

        const totalViews = assets.reduce((sum, a) => sum + (a.views || 0), 0);

        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();

        const data = JSON.stringify({
          totalAssets,
          totalUsers,
          totalViews,
          assetsByStatus,
          recentAssets: assets,
          systemInfo: {
            uptime: process.uptime(),
            memoryUsage: {
              rss: Math.round(memoryUsage.rss / 1024 / 1024),
              heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
              heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
              external: Math.round(memoryUsage.external / 1024 / 1024)
            },
            cpuUsage: {
              user: cpuUsage.user,
              system: cpuUsage.system
            }
          },
          timestamp: new Date().toISOString()
        });

        reply.raw.write(`data: ${data}\n\n`);
      } catch (error) {
        fastify.log.error({ error }, 'Stream error');
      }
    };

    sendStats();
    const interval = setInterval(sendStats, 2000);

    request.raw.on('close', () => {
      clearInterval(interval);
    });
  });

  fastify.get<{ Params: { userId: string } }>('/:userId/content', async (request, reply) => {
    try {
      const { userId } = request.params;

      const userAssets = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.userId, userId),
        orderBy: [fastify.desc(fastify.schema.assets.createdAt)],
        limit: 10
      });

      const userCategories = await fastify.db.query.categories.findMany({
        where: (categories, { eq }) => eq(categories.userId, userId),
        orderBy: [fastify.desc(fastify.schema.categories.createdAt)],
        limit: 10
      });

      return reply.send({
        assets: userAssets,
        categories: userCategories
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.delete<{ Params: { userId: string } }>('/:userId', async (request, reply) => {
    try {
      const { userId } = request.params;

      await fastify.db.delete(fastify.schema.sessions)
        .where(fastify.eq(fastify.schema.sessions.userId, userId));

      const userCategories = await fastify.db.query.categories.findMany({
        where: (categories, { eq }) => eq(categories.userId, userId)
      });
      for (const cat of userCategories) {
        await fastify.db.update(fastify.schema.assets)
          .set({ categoryId: null })
          .where(fastify.eq(fastify.schema.assets.categoryId, cat.id));
      }

      await fastify.db.delete(fastify.schema.categories)
        .where(fastify.eq(fastify.schema.categories.userId, userId));

      await fastify.db.delete(fastify.schema.analyticsEvents)
        .where(fastify.eq(fastify.schema.analyticsEvents.assetId, userId as any));

      await fastify.db.delete(fastify.schema.comments)
        .where(fastify.eq(fastify.schema.comments.userId, userId as any));

      const userAssets = await fastify.db.query.assets.findMany({
        where: (assets, { eq }) => eq(assets.userId, userId)
      });
      for (const asset of userAssets) {
        await fastify.db.delete(fastify.schema.reactions)
          .where(fastify.eq(fastify.schema.reactions.assetId, asset.id));
      }

      await fastify.db.delete(fastify.schema.assets)
        .where(fastify.eq(fastify.schema.assets.userId, userId));

      await fastify.db.delete(fastify.schema.orgMembers)
        .where(fastify.eq(fastify.schema.orgMembers.userId, userId));

      await fastify.db.delete(fastify.schema.users)
        .where(fastify.eq(fastify.schema.users.id, userId));

      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}