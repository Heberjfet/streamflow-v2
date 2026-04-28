import { FastifyInstance } from 'fastify';
import { WEBHOOK_EVENTS } from '../db/schema.js';

export interface WebhookPayload {
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export class WebhookService {
  constructor(private fastify: FastifyInstance) {}

  async fireWebhooks(orgId: string | null, event: string, data: Record<string, unknown>): Promise<void> {
    const urls: string[] = [];

    try {
      const globalWebhookUrl = process.env.WEBHOOK_URL;
      if (globalWebhookUrl) {
        urls.push(globalWebhookUrl);
      }

      if (orgId) {
        const orgWebhooks = await this.fastify.db.query.webhooks.findMany({
          where: (webhooks, { eq, and }) => and(
            eq(webhooks.orgId, orgId),
            eq(webhooks.active, true)
          )
        });

        for (const webhook of orgWebhooks) {
          const webhookEvents = webhook.events as string[];
          if (webhookEvents.includes(event)) {
            urls.push(webhook.url);
          }
        }
      }
    } catch (error) {
      this.fastify.log.error({ err: error }, 'Error fetching webhooks');
    }

    const payload: WebhookPayload = {
      type: event,
      data,
      timestamp: new Date().toISOString()
    };

    await Promise.allSettled(
      urls.map(async (url) => {
        try {
          await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(10000)
          });
          this.fastify.log.info(`Webhook fired: ${event} to ${url}`);
        } catch (err) {
          this.fastify.log.warn({ err, event, url }, `Webhook failed`);
        }
      })
    );
  }

  async fireAssetReady(orgId: string | null, assetId: string, playbackId: string, duration: number): Promise<void> {
    await this.fireWebhooks(orgId, WEBHOOK_EVENTS.ASSET_READY, {
      assetId,
      playbackId,
      duration
    });
  }

  async fireAssetError(orgId: string | null, assetId: string, errorMessage: string): Promise<void> {
    await this.fireWebhooks(orgId, WEBHOOK_EVENTS.ASSET_ERROR, {
      assetId,
      errorMessage
    });
  }

  async fireAssetDeleted(orgId: string | null, assetId: string): Promise<void> {
    await this.fireWebhooks(orgId, WEBHOOK_EVENTS.ASSET_DELETED, {
      assetId
    });
  }
}

export function createWebhookService(fastify: FastifyInstance): WebhookService {
  return new WebhookService(fastify);
}