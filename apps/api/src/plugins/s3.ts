import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Config } from '../types/index.js';

const s3Config: S3Config = {
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  region: process.env.S3_REGION || 'us-east-1',
  bucket: process.env.S3_BUCKET || 'streamflow',
  accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
  secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
  publicUrl: process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT || 'http://localhost:9000'
};

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  region: s3Config.region,
  credentials: {
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.secretAccessKey
  },
  forcePathStyle: true
});

const getBrowserEndpoint = () => {
  return process.env.S3_BROWSER_ENDPOINT || process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT || 'http://localhost:9000';
};

export default fp(async function s3Plugin(fastify: FastifyInstance) {
  fastify.decorate('s3', s3Client);
  fastify.decorate('s3Config', s3Config);
  fastify.decorate('generateUploadUrl', async (key: string, contentType: string) => {
    const command = new PutObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
      ContentType: contentType
    });
    let url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    url = url.replace(s3Config.endpoint, getBrowserEndpoint());
    const urlObj = new URL(url);
    urlObj.searchParams.delete('x-amz-checksum-crc32');
    urlObj.searchParams.delete('x-amz-sdk-checksum-algorithm');
    return urlObj.toString();
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    s3: S3Client;
    s3Config: S3Config;
  }
}

export { s3Client, s3Config };
