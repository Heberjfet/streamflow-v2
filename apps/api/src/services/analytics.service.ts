import { FastifyInstance } from 'fastify';
import { ANALYTICS_EVENT_TYPES } from '../db/schema.js';

export interface AnalyticsEventData {
  eventType: string;
  assetId?: string;
  playbackId?: string;
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

export class AnalyticsService {
  constructor(private fastify: FastifyInstance) {}

  async trackEvent(orgId: string | null, data: AnalyticsEventData): Promise<void> {
    try {
      await this.fastify.db.insert(this.fastify.schema.analyticsEvents).values({
        orgId,
        assetId: data.assetId,
        playbackId: data.playbackId,
        sessionId: data.sessionId,
        eventType: data.eventType,
        currentTime: data.currentTime,
        duration: data.duration,
        qualityHeight: data.qualityHeight,
        referrer: data.referrer,
        playerType: data.playerType,
        bufferDurationMs: data.bufferDurationMs,
        errorMessage: data.errorMessage,
        metadata: data.metadata
      });
    } catch (error) {
      this.fastify.log.error({ err: error }, 'Error tracking analytics event');
    }
  }

  async trackViewStart(orgId: string | null, data: {
    playbackId: string;
    sessionId: string;
    currentTime: number;
    duration: number;
    qualityHeight: number;
    referrer?: string;
    playerType?: string;
  }): Promise<void> {
    await this.trackEvent(orgId, {
      eventType: ANALYTICS_EVENT_TYPES.VIEW_START,
      playbackId: data.playbackId,
      sessionId: data.sessionId,
      currentTime: data.currentTime,
      duration: data.duration,
      qualityHeight: data.qualityHeight,
      referrer: data.referrer,
      playerType: data.playerType
    });
  }

  async trackHeartbeat(orgId: string | null, data: {
    playbackId: string;
    sessionId: string;
    currentTime: number;
    duration: number;
    qualityHeight: number;
  }): Promise<void> {
    await this.trackEvent(orgId, {
      eventType: ANALYTICS_EVENT_TYPES.HEARTBEAT,
      playbackId: data.playbackId,
      sessionId: data.sessionId,
      currentTime: data.currentTime,
      duration: data.duration,
      qualityHeight: data.qualityHeight
    });
  }

  async trackQualityChange(orgId: string | null, data: {
    playbackId: string;
    sessionId: string;
    qualityHeight: number;
  }): Promise<void> {
    await this.trackEvent(orgId, {
      eventType: ANALYTICS_EVENT_TYPES.QUALITY_CHANGE,
      playbackId: data.playbackId,
      sessionId: data.sessionId,
      qualityHeight: data.qualityHeight
    });
  }

  async trackSeek(orgId: string | null, data: {
    playbackId: string;
    sessionId: string;
    currentTime: number;
  }): Promise<void> {
    await this.trackEvent(orgId, {
      eventType: ANALYTICS_EVENT_TYPES.SEEK,
      playbackId: data.playbackId,
      sessionId: data.sessionId,
      currentTime: data.currentTime
    });
  }

  async trackBuffer(orgId: string | null, data: {
    playbackId: string;
    sessionId: string;
    bufferDurationMs: number;
    isStart: boolean;
  }): Promise<void> {
    await this.trackEvent(orgId, {
      eventType: data.isStart ? ANALYTICS_EVENT_TYPES.BUFFER_START : ANALYTICS_EVENT_TYPES.BUFFER_END,
      playbackId: data.playbackId,
      sessionId: data.sessionId,
      bufferDurationMs: data.bufferDurationMs
    });
  }

  async trackError(orgId: string | null, data: {
    playbackId: string;
    sessionId: string;
    errorMessage: string;
  }): Promise<void> {
    await this.trackEvent(orgId, {
      eventType: ANALYTICS_EVENT_TYPES.ERROR,
      playbackId: data.playbackId,
      sessionId: data.sessionId,
      errorMessage: data.errorMessage
    });
  }

  async trackViewEnd(orgId: string | null, data: {
    playbackId: string;
    sessionId: string;
    currentTime: number;
    duration: number;
  }): Promise<void> {
    await this.trackEvent(orgId, {
      eventType: ANALYTICS_EVENT_TYPES.VIEW_END,
      playbackId: data.playbackId,
      sessionId: data.sessionId,
      currentTime: data.currentTime,
      duration: data.duration
    });
  }

  async getAssetAnalytics(assetId: string, period: string = '7d') {
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'all':
        startDate = new Date(0);
        break;
    }

    const events = await this.fastify.db.query.analyticsEvents.findMany({
      where: (events, { and, eq, gte }) => and(
        eq(events.assetId, assetId),
        gte(events.createdAt, startDate)
      )
    });

    const viewStarts = events.filter(e => e.eventType === ANALYTICS_EVENT_TYPES.VIEW_START);
    const heartbeats = events.filter(e => e.eventType === ANALYTICS_EVENT_TYPES.HEARTBEAT);
    const uniqueSessions = new Set(viewStarts.map(e => e.sessionId));

    const totalWatchTime = heartbeats.length * 10;
    const avgWatchPercent = viewStarts.length > 0
      ? viewStarts.reduce((sum, e) => sum + ((e.currentTime || 0) / (e.duration || 1)) * 100, 0) / viewStarts.length
      : 0;

    return {
      totalViews: viewStarts.length,
      uniqueSessions: uniqueSessions.size,
      totalWatchTimeSec: totalWatchTime,
      avgWatchPercent: Math.round(avgWatchPercent * 100) / 100,
      period,
      periodStart: startDate.toISOString(),
      periodEnd: now.toISOString()
    };
  }
}

export function createAnalyticsService(fastify: FastifyInstance): AnalyticsService {
  return new AnalyticsService(fastify);
}