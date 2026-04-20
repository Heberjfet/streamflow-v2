export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  googleId?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Asset {
  id: string;
  userId: string;
  title: string;
  description?: string;
  categoryId?: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  playbackId?: string;
  duration?: number;
  thumbnailUrl?: string;
  hlsManifestUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface S3Config {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicUrl: string;
}

export interface QueueConfig {
  host: string;
  port: number;
}
