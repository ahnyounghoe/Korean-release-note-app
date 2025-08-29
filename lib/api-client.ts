import { App, AppWithReleases, ReleaseNote, CreateAppRequest, UpdateAppRequest, CreateReleaseNoteRequest, UpdateReleaseNoteRequest, PublishReleaseNoteRequest } from './types'

const API_BASE_URL = '/api'

// 앱 관련 API
export const appApi = {
  // 모든 앱 목록 조회
  async getAll(): Promise<AppWithReleases[]> {
    const response = await fetch(`${API_BASE_URL}/apps`)
    if (!response.ok) {
      throw new Error('Failed to fetch apps')
    }
    return response.json()
  },

  // 특정 앱 조회
  async getById(id: string): Promise<AppWithReleases> {
    const response = await fetch(`${API_BASE_URL}/apps/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch app')
    }
    return response.json()
  },

  // 새 앱 생성
  async create(data: CreateAppRequest): Promise<App> {
    const response = await fetch(`${API_BASE_URL}/apps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create app')
    }
    return response.json()
  },

  // 앱 정보 수정
  async update(id: string, data: UpdateAppRequest): Promise<App> {
    const response = await fetch(`${API_BASE_URL}/apps/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update app')
    }
    return response.json()
  },

  // 앱 삭제
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/apps/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete app')
    }
  }
}

// 릴리즈 노트 관련 API
export const releaseApi = {
  // 특정 앱의 릴리즈 노트 목록 조회
  async getByAppId(appId: string): Promise<ReleaseNote[]> {
    const response = await fetch(`${API_BASE_URL}/apps/${appId}/releases`)
    if (!response.ok) {
      throw new Error('Failed to fetch releases')
    }
    return response.json()
  },

  // 특정 릴리즈 노트 조회
  async getById(appId: string, releaseId: string): Promise<ReleaseNote> {
    const response = await fetch(`${API_BASE_URL}/apps/${appId}/releases/${releaseId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch release')
    }
    return response.json()
  },

  // 새 릴리즈 노트 생성
  async create(appId: string, data: CreateReleaseNoteRequest): Promise<ReleaseNote> {
    const response = await fetch(`${API_BASE_URL}/apps/${appId}/releases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create release')
    }
    return response.json()
  },

  // 릴리즈 노트 수정
  async update(appId: string, releaseId: string, data: UpdateReleaseNoteRequest): Promise<ReleaseNote> {
    const response = await fetch(`${API_BASE_URL}/apps/${appId}/releases/${releaseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update release')
    }
    return response.json()
  },

  // 릴리즈 노트 삭제
  async delete(appId: string, releaseId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/apps/${appId}/releases/${releaseId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete release')
    }
  },

  // 릴리즈 노트 발행
  async publish(appId: string, releaseId: string, data: PublishReleaseNoteRequest): Promise<ReleaseNote> {
    const response = await fetch(`${API_BASE_URL}/apps/${appId}/releases/${releaseId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to publish release')
    }
    return response.json()
  }
}
