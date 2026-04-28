import { FastifyInstance } from 'fastify';
import { WEBHOOK_EVENTS } from '../db/schema.js';

interface CreateOrgBody {
  name: string;
  slug: string;
}

interface CreateApiKeyBody {
  name: string;
}

interface WebhookBody {
  url: string;
  events: string[];
}

export async function orgRoutes(fastify: FastifyInstance) {

  fastify.post<{ Body: CreateOrgBody }>('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { name, slug } = request.body;

      const [existing] = await fastify.db.query.organizations.findMany({
        where: (organizations, { eq }) => eq(organizations.slug, slug)
      });

      if (existing) {
        return reply.status(400).send({ error: 'Slug already taken' });
      }

      const [org] = await fastify.db
        .insert(fastify.schema.organizations)
        .values({
          name,
          slug,
          ownerId: request.currentUser!.userId,
          tier: 'free'
        })
        .returning();

      await fastify.db
        .insert(fastify.schema.orgMembers)
        .values({
          orgId: org.id,
          userId: request.currentUser!.userId,
          role: 'owner'
        });

      return reply.status(201).send(org);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get<{ Params: { orgId: string } }>('/:orgId', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { orgId } = request.params;
      const userId = request.currentUser!.userId;

      const members = await fastify.db.query.orgMembers.findMany({
        where: (orgMembers, { and, eq }) => and(
          eq(orgMembers.orgId, orgId),
          eq(orgMembers.userId, userId)
        )
      });

      if (members.length === 0) {
        return reply.status(403).send({ error: 'Not a member of this organization' });
      }

      const [org] = await fastify.db.query.organizations.findMany({
        where: (organizations, { eq }) => eq(organizations.id, orgId)
      });

      if (!org) {
        return reply.status(404).send({ error: 'Organization not found' });
      }

      return reply.send({
        ...org,
        role: members[0].role
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get<{ Params: { orgId: string } }>('/:orgId/members', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { orgId } = request.params;
      const userId = request.currentUser!.userId;

      const members = await fastify.db.query.orgMembers.findMany({
        where: (orgMembers, { and, eq }) => and(
          eq(orgMembers.orgId, orgId),
          eq(orgMembers.userId, userId)
        )
      });

      if (members.length === 0) {
        return reply.status(403).send({ error: 'Not a member of this organization' });
      }

      const allMembers = await fastify.db.query.orgMembers.findMany({
        where: (orgMembers, { eq }) => eq(orgMembers.orgId, orgId)
      });

      const userIds = allMembers.map(m => m.userId);
      const users = await fastify.db.query.users.findMany({
        where: (users, { inArray }) => inArray(users.id, userIds)
      });

      const membersWithUsers = allMembers.map(m => {
        const user = users.find(u => u.id === m.userId);
        return {
          ...m,
          user: user ? { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl } : null
        };
      });

      return reply.send({ data: membersWithUsers });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Params: { orgId: string }; Body: { email: string; role?: string } }>('/:orgId/members', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { orgId } = request.params;
      const { email, role = 'member' } = request.body;
      const userId = request.currentUser!.userId;

      const callerMembers = await fastify.db.query.orgMembers.findMany({
        where: (orgMembers, { and, eq }) => and(
          eq(orgMembers.orgId, orgId),
          eq(orgMembers.userId, userId)
        )
      });

      if (callerMembers.length === 0 || (callerMembers[0].role !== 'owner' && callerMembers[0].role !== 'admin')) {
        return reply.status(403).send({ error: 'Only owners and admins can add members' });
      }

      const [user] = await fastify.db.query.users.findMany({
        where: (users, { eq }) => eq(users.email, email)
      });

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      const existingMembers = await fastify.db.query.orgMembers.findMany({
        where: (orgMembers, { and, eq }) => and(
          eq(orgMembers.orgId, orgId),
          eq(orgMembers.userId, user.id)
        )
      });

      if (existingMembers.length > 0) {
        return reply.status(400).send({ error: 'User is already a member' });
      }

      const [member] = await fastify.db
        .insert(fastify.schema.orgMembers)
        .values({
          orgId,
          userId: user.id,
          role
        })
        .returning();

      return reply.status(201).send({ ...member, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.delete<{ Params: { orgId: string; memberId: string } }>('/:orgId/members/:memberId', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { orgId, memberId } = request.params;
      const userId = request.currentUser!.userId;

      const callerMembers = await fastify.db.query.orgMembers.findMany({
        where: (orgMembers, { and, eq }) => and(
          eq(orgMembers.orgId, orgId),
          eq(orgMembers.userId, userId)
        )
      });

      if (callerMembers.length === 0 || (callerMembers[0].role !== 'owner' && callerMembers[0].role !== 'admin')) {
        return reply.status(403).send({ error: 'Only owners and admins can remove members' });
      }

      const [memberToRemove] = await fastify.db.query.orgMembers.findMany({
        where: (orgMembers, { eq }) => eq(orgMembers.id, memberId)
      });

      if (!memberToRemove) {
        return reply.status(404).send({ error: 'Member not found' });
      }

      if (memberToRemove.role === 'owner') {
        return reply.status(403).send({ error: 'Cannot remove the owner' });
      }

      await fastify.db
        .delete(fastify.schema.orgMembers)
        .where(fastify.eq(fastify.schema.orgMembers.id, memberId));

      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get<{ Params: { orgId: string } }>('/:orgId/api-keys', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { orgId } = request.params;
      const userId = request.currentUser!.userId;

      const members = await fastify.db.query.orgMembers.findMany({
        where: (orgMembers, { and, eq }) => and(
          eq(orgMembers.orgId, orgId),
          eq(orgMembers.userId, userId)
        )
      });

      if (members.length === 0 || (members[0].role !== 'owner' && members[0].role !== 'admin')) {
        return reply.status(403).send({ error: 'Only owners and admins can view API keys' });
      }

      const apiKeys = await fastify.db.query.apiKeys.findMany({
        where: (apiKeys, { eq }) => eq(apiKeys.orgId, orgId)
      });

      const sanitizedKeys = apiKeys.map(k => ({
        id: k.id,
        name: k.name,
        keyPrefix: k.keyPrefix,
        lastUsedAt: k.lastUsedAt,
        createdAt: k.createdAt
      }));

      return reply.send({ data: sanitizedKeys });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Params: { orgId: string }; Body: CreateApiKeyBody }>('/:orgId/api-keys', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { orgId } = request.params;
      const { name } = request.body;
      const userId = request.currentUser!.userId;

      const members = await fastify.db.query.orgMembers.findMany({
        where: (orgMembers, { and, eq }) => and(
          eq(orgMembers.orgId, orgId),
          eq(orgMembers.userId, userId)
        )
      });

      if (members.length === 0 || (members[0].role !== 'owner' && members[0].role !== 'admin')) {
        return reply.status(403).send({ error: 'Only owners and admins can create API keys' });
      }

      const { key, keyHash, keyPrefix } = fastify.generateApiKey();

      const [apiKey] = await fastify.db
        .insert(fastify.schema.apiKeys)
        .values({
          orgId,
          name,
          keyHash,
          keyPrefix
        })
        .returning();

      return reply.status(201).send({
        id: apiKey.id,
        name: apiKey.name,
        key,
        keyPrefix: apiKey.keyPrefix,
        createdAt: apiKey.createdAt
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.delete<{ Params: { orgId: string; keyId: string } }>('/:orgId/api-keys/:keyId', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { orgId, keyId } = request.params;
      const userId = request.currentUser!.userId;

      const members = await fastify.db.query.orgMembers.findMany({
        where: (orgMembers, { and, eq }) => and(
          eq(orgMembers.orgId, orgId),
          eq(orgMembers.userId, userId)
        )
      });

      if (members.length === 0 || (members[0].role !== 'owner' && members[0].role !== 'admin')) {
        return reply.status(403).send({ error: 'Only owners and admins can delete API keys' });
      }

      await fastify.db
        .delete(fastify.schema.apiKeys)
        .where(fastify.eq(fastify.schema.apiKeys.id, keyId));

      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get<{ Params: { orgId: string } }>('/:orgId/webhooks', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { orgId } = request.params;
      const userId = request.currentUser!.userId;

      const members = await fastify.db.query.orgMembers.findMany({
        where: (orgMembers, { and, eq }) => and(
          eq(orgMembers.orgId, orgId),
          eq(orgMembers.userId, userId)
        )
      });

      if (members.length === 0 || (members[0].role !== 'owner' && members[0].role !== 'admin')) {
        return reply.status(403).send({ error: 'Only owners and admins can view webhooks' });
      }

      const webhooks = await fastify.db.query.webhooks.findMany({
        where: (webhooks, { eq }) => eq(webhooks.orgId, orgId)
      });

      return reply.send({ data: webhooks });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Params: { orgId: string }; Body: WebhookBody }>('/:orgId/webhooks', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { orgId } = request.params;
      const { url, events } = request.body;
      const userId = request.currentUser!.userId;

      if (!url || !events || !Array.isArray(events)) {
        return reply.status(400).send({ error: 'URL and events array are required' });
      }

      for (const event of events) {
        if (!Object.values(WEBHOOK_EVENTS).includes(event as typeof WEBHOOK_EVENTS[keyof typeof WEBHOOK_EVENTS])) {
          return reply.status(400).send({ error: `Invalid event type: ${event}` });
        }
      }

      const members = await fastify.db.query.orgMembers.findMany({
        where: (orgMembers, { and, eq }) => and(
          eq(orgMembers.orgId, orgId),
          eq(orgMembers.userId, userId)
        )
      });

      if (members.length === 0 || (members[0].role !== 'owner' && members[0].role !== 'admin')) {
        return reply.status(403).send({ error: 'Only owners and admins can create webhooks' });
      }

      const [webhook] = await fastify.db
        .insert(fastify.schema.webhooks)
        .values({
          orgId,
          url,
          events
        })
        .returning();

      return reply.status(201).send(webhook);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.delete<{ Params: { orgId: string; webhookId: string } }>('/:orgId/webhooks/:webhookId', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { orgId, webhookId } = request.params;
      const userId = request.currentUser!.userId;

      const members = await fastify.db.query.orgMembers.findMany({
        where: (orgMembers, { and, eq }) => and(
          eq(orgMembers.orgId, orgId),
          eq(orgMembers.userId, userId)
        )
      });

      if (members.length === 0 || (members[0].role !== 'owner' && members[0].role !== 'admin')) {
        return reply.status(403).send({ error: 'Only owners and admins can delete webhooks' });
      }

      await fastify.db
        .delete(fastify.schema.webhooks)
        .where(fastify.eq(fastify.schema.webhooks.id, webhookId));

      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}