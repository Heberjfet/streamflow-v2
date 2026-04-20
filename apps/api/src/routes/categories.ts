import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface CreateCategoryBody {
  name: string;
  description?: string;
}

interface UpdateCategoryBody {
  name?: string;
  description?: string;
}

interface CategoryParams {
  id: string;
}

export async function categoryRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    try {
      const categories = await fastify.db.query.categories.findMany({
        orderBy: [fastify.schema.categories.name]
      });

      return reply.send(categories);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Body: CreateCategoryBody }>('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { name, description } = request.body;
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const [category] = await fastify.db
        .insert(fastify.schema.categories)
        .values({
          name,
          slug,
          description
        })
        .returning();

      return reply.status(201).send(category);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get<{ Params: CategoryParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      const category = await fastify.db.query.categories.findFirst({
        where: fastify.eq(fastify.schema.categories.id, id)
      });

      if (!category) {
        return reply.status(404).send({ error: 'Category not found' });
      }

      return reply.send(category);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.put<{ Params: CategoryParams; Body: UpdateCategoryBody }>('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { name, description } = request.body;

      const updates: any = {};
      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;

      const [category] = await fastify.db
        .update(fastify.schema.categories)
        .set(updates)
        .where(fastify.eq(fastify.schema.categories.id, id))
        .returning();

      if (!category) {
        return reply.status(404).send({ error: 'Category not found' });
      }

      return reply.send(category);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.delete<{ Params: CategoryParams }>('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;

      await fastify.db
        .delete(fastify.schema.categories)
        .where(fastify.eq(fastify.schema.categories.id, id));

      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
