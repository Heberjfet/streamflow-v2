export interface RenditionConfig {
  name: string;
  width: number;
  height: number;
  videoBitrate: string;
  audioBitrate: string;
}

export interface TranscodeJobData {
  assetId: string;
  sourceKey: string;
  renditions: RenditionConfig[];
}

export interface ThumbnailJobData {
  assetId: string;
  sourceKey: string;
}

export interface JobResult {
  success: boolean;
  assetId: string;
  outputKeys?: string[];
  error?: string;
}

export interface AssetStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  outputKey?: string;
  error?: string;
}

export const RENDITIONS: RenditionConfig[] = [
  { name: '360p', width: 640, height: 360, videoBitrate: '800k', audioBitrate: '64k' },
  { name: '720p', width: 1280, height: 720, videoBitrate: '2000k', audioBitrate: '128k' },
  { name: '1080p', width: 1920, height: 1080, videoBitrate: '4000k', audioBitrate: '128k' },
];

export const VIDEO_QUEUE_NAME = 'video-processing';
export const JOB_TYPES = {
  TRANSCODE: 'transcode',
  GENERATE_THUMBNAILS: 'generate-thumbnails',
} as const;