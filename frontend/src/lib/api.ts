const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:3001`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
}

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
  const text = await res.text()
  if (!text) return { data: undefined as T }
  const data = JSON.parse(text)
  return { data }
}

export const login = async (email: string, password: string) => {
  const res = await fetch(`${getApiUrl()}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return handleResponse<{ token: string; user: { id: string; email: string; name: string; role: string } }>(res)
}

export const register = async (email: string, password: string, name: string) => {
  const res = await fetch(`${getApiUrl()}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })
  return handleResponse<{ token: string; user: { id: string; email: string; name: string; role: string } }>(res)
}

export interface Asset {
  id: string
  title: string
  description?: string
  status: 'pending' | 'uploading' | 'processing' | 'ready' | 'completed' | 'failed'
  playbackId?: string
  thumbnailKey?: string
  hlsManifestKey?: string
  duration?: number
  views?: number
  createdAt: string
  updatedAt: string
}

export const getAssets = async (): Promise<ApiResponse<{ data: Asset[]; page: number; limit: number }>> => {
  const res = await fetch(`${getApiUrl()}/v1/assets`, {
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  })
  return handleResponse<{ data: Asset[]; page: number; limit: number }>(res)
}

export const getAsset = async (assetId: string): Promise<ApiResponse<Asset>> => {
  const res = await fetch(`${getApiUrl()}/v1/assets/${assetId}`, {
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  })
  return handleResponse<Asset>(res)
}

export const createAsset = async (title: string): Promise<ApiResponse<Asset>> => {
  const res = await fetch(`${getApiUrl()}/v1/assets`, {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  return handleResponse<Asset>(res)
}

export const deleteAsset = async (assetId: string): Promise<ApiResponse<void>> => {
  const res = await fetch(`${getApiUrl()}/v1/assets/${assetId}`, {
    method: 'DELETE',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  })
  if (res.status === 204) return { data: undefined }
  return handleResponse<void>(res)
}

export const getUploadUrl = async (assetId: string, filename: string, contentType: string): Promise<ApiResponse<{ uploadUrl: string; key: string }>> => {
  const res = await fetch(`${getApiUrl()}/v1/assets/${assetId}/upload-url`, {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, contentType }),
  })
  return handleResponse<{ uploadUrl: string; key: string }>(res)
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
  const res = await fetch(`${getApiUrl()}/v1/assets/${assetId}/process`, {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: '{}',
  })
  return handleResponse<void>(res)
}

export interface PlaybackResponse {
  manifestUrl: string
  thumbnailUrl?: string
}

export const getPlayback = async (playbackId: string): Promise<ApiResponse<PlaybackResponse>> => {
  const res = await fetch(`${getApiUrl()}/v1/playback/${playbackId}`, {
    headers: { 'Content-Type': 'application/json' },
  })
  return handleResponse<PlaybackResponse>(res)
}

export const getPublicPlayback = async (assetId: string): Promise<ApiResponse<PlaybackResponse>> => {
  const res = await fetch(`${getApiUrl()}/v1/assets/${assetId}/playback`, {
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  })
  return handleResponse<PlaybackResponse>(res)
}

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  role: 'admin' | 'editor' | 'viewer'
  createdAt: string
  updatedAt: string
}

export interface UsersResponse {
  data: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const getUsers = async (page = 1, limit = 20, role?: string): Promise<ApiResponse<UsersResponse>> => {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
  if (role && role !== 'all') params.append('role', role)
  const res = await fetch(`${getApiUrl()}/v1/users?${params.toString()}`, {
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  })
  return handleResponse<UsersResponse>(res)
}

export const getUser = async (userId: string): Promise<ApiResponse<User>> => {
  const res = await fetch(`${getApiUrl()}/v1/users/${userId}`, {
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  })
  return handleResponse<User>(res)
}

export const createUser = async (data: { email: string; name: string; password: string; role?: string }): Promise<ApiResponse<User>> => {
  const res = await fetch(`${getApiUrl()}/v1/users`, {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<User>(res)
}

export const updateUser = async (userId: string, data: { name?: string; email?: string; role?: string; password?: string }): Promise<ApiResponse<User>> => {
  const res = await fetch(`${getApiUrl()}/v1/users/${userId}`, {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<User>(res)
}

export const deleteUser = async (userId: string): Promise<ApiResponse<void>> => {
  const res = await fetch(`${getApiUrl()}/v1/users/${userId}`, {
    method: 'DELETE',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  })
  if (res.status === 204) return { data: undefined }
  return handleResponse<void>(res)
}
