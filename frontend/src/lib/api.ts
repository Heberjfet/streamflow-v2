const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const authHeader = (): HeadersInit => {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('streamflow_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

interface ApiResponse<T = unknown> {
  data?: T
  error?: string
}

const handleResponse = async <T>(res: Response): Promise<ApiResponse<T>> => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }))
    return { error: error.error || error.message || `HTTP ${res.status}` }
  }
  const data = await res.json()
  return { data }
}

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return handleResponse<{ token: string; user: { id: string; email: string; name: string } }>(res)
}

export const register = async (email: string, password: string, name: string) => {
  const res = await fetch(`${API_URL}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })
  return handleResponse<{ token: string; user: { id: string; email: string; name: string } }>(res)
}

export interface Asset {
  id: string
  title: string
  status: 'pending' | 'uploading' | 'processing' | 'ready' | 'failed'
  playbackId?: string
  thumbnailUrl?: string
  duration?: number
  createdAt: string
  updatedAt: string
}

export const getAssets = async (): Promise<ApiResponse<Asset[]>> => {
  const res = await fetch(`${API_URL}/v1/assets`, {
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  })
  return handleResponse<Asset[]>(res)
}

export const getAsset = async (assetId: string): Promise<ApiResponse<Asset>> => {
  const res = await fetch(`${API_URL}/v1/assets/${assetId}`, {
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  })
  return handleResponse<Asset>(res)
}

export const createAsset = async (title: string): Promise<ApiResponse<Asset>> => {
  const res = await fetch(`${API_URL}/v1/assets`, {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  return handleResponse<Asset>(res)
}

export const deleteAsset = async (assetId: string): Promise<ApiResponse<void>> => {
  const res = await fetch(`${API_URL}/v1/assets/${assetId}`, {
    method: 'DELETE',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  })
  return handleResponse<void>(res)
}

export const getUploadUrl = async (assetId: string): Promise<ApiResponse<{ uploadUrl: string }>> => {
  const res = await fetch(`${API_URL}/v1/assets/${assetId}/upload-url`, {
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  })
  return handleResponse<{ uploadUrl: string }>(res)
}

export const uploadToS3 = async (uploadUrl: string, file: File): Promise<Response> => {
  return fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  })
}

export const processAsset = async (assetId: string): Promise<ApiResponse<void>> => {
  const res = await fetch(`${API_URL}/v1/assets/${assetId}/process`, {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  })
  return handleResponse<void>(res)
}

export interface PlaybackResponse {
  playbackId: string
  hlsUrl: string
  mp4Url?: string
  thumbnailUrl?: string
  title: string
  duration?: number
}

export const getPlayback = async (playbackId: string): Promise<ApiResponse<PlaybackResponse>> => {
  const res = await fetch(`${API_URL}/v1/playback/${playbackId}`, {
    headers: { 'Content-Type': 'application/json' },
  })
  return handleResponse<PlaybackResponse>(res)
}

export const getPublicPlayback = async (assetId: string): Promise<ApiResponse<PlaybackResponse>> => {
  const res = await fetch(`${API_URL}/v1/assets/${assetId}/playback`, {
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  })
  return handleResponse<PlaybackResponse>(res)
}
