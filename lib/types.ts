export interface PublishHistory {
  id: string
  timestamp: string
  publisher: string
  version: string
}

export interface ReleaseNote {
  id: string
  version: string
  title: string
  date: string
  content: string
  type: "major" | "minor" | "patch"
  isPublished: boolean
  publishHistory: PublishHistory[]
  createdAt: string
  updatedAt: string
}

export interface App {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface AppWithReleases extends App {
  releaseNotes: ReleaseNote[]
}

export interface CreateAppRequest {
  name: string
}

export interface UpdateAppRequest {
  name: string
}

export interface CreateReleaseNoteRequest {
  version: string
  title: string
  content: string
  type: "major" | "minor" | "patch"
}

export interface UpdateReleaseNoteRequest {
  version?: string
  title?: string
  content?: string
  type?: "major" | "minor" | "patch"
}

export interface PublishReleaseNoteRequest {
  publisher: string
}
