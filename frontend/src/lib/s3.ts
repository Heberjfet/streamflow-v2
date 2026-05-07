const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_S3_URL || `http://${window.location.hostname}:9000`
  }
  return process.env.NEXT_PUBLIC_S3_URL || 'http://localhost:9000'
}

export const getS3Url = (key: string): string => {
  const base = getBaseUrl().replace(/\/?$/, '')
  const bucket = process.env.NEXT_PUBLIC_S3_BUCKET || 'streamflow'
  return `${base}/${bucket}/${key}`
}

export const fixS3Hostname = (url: string): string => {
  if (!url || typeof window === 'undefined') return url
  const hostname = window.location.hostname
  if (url.includes('localhost:9000') || url.includes('minio:9000')) {
    return url.replace(/localhost:9000|minio:9000/, `${hostname}:9000`)
  }
  return url
}
