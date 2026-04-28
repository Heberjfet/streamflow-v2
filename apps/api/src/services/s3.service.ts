import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Config } from '../types/index.js';

export class S3Service {
  constructor(
    private readonly s3: S3Client,
    private readonly config: S3Config
  ) {}

  async generateUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
      ContentType: contentType
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }

  async generatePlaybackUrl(
    key: string,
    expiresIn: number = 86400
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: key
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }

  getPublicUrl(key: string): string {
    return `${this.config.publicUrl}/${this.config.bucket}/${key}`;
  }

  async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: key
    });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  getAssetPath(userId: string, assetId: string, filename: string): string {
    return `uploads/${userId}/${assetId}/${filename}`;
  }

  getHlsPath(assetId: string): string {
    return `hls/${assetId}/master.m3u8`;
  }

  getThumbnailPath(assetId: string): string {
    return `thumbnails/${assetId}/thumb.jpg`;
  }
}
