import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { App, ReleaseNote, AppWithReleases } from './types'

// 환경 변수에서 데이터 디렉토리 경로를 가져오거나 기본값 사용
const getDataDir = () => {
  const envDataDir = process.env.DATA_DIR
  if (envDataDir) {
    // 절대 경로인지 확인
    if (path.isAbsolute(envDataDir)) {
      return envDataDir
    } else {
      // 상대 경로인 경우 process.cwd() 기준으로 해석
      return path.resolve(process.cwd(), envDataDir)
    }
  }
  // 기본값: 프로젝트 루트의 data 디렉토리
  return path.join(process.cwd(), 'data')
}

const DATA_DIR = getDataDir()
const APPS_DIR = path.join(DATA_DIR, 'apps')
const RELEASES_DIR = path.join(DATA_DIR, 'releases')

// 디렉토리가 존재하지 않으면 생성
async function ensureDirectoryExists(dir: string) {
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

// 앱 데이터 관리
export class AppDataManager {
  static async getAllApps(): Promise<App[]> {
    await ensureDirectoryExists(APPS_DIR)
    
    try {
      const files = await fs.readdir(APPS_DIR)
      const apps: App[] = []
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(APPS_DIR, file)
          const content = await fs.readFile(filePath, 'utf-8')
          const app = JSON.parse(content) as App
          apps.push(app)
        }
      }
      
      return apps.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    } catch (error) {
      console.error('Error reading apps:', error)
      return []
    }
  }

  static async getAppById(id: string): Promise<App | null> {
    await ensureDirectoryExists(APPS_DIR)
    
    try {
      const filePath = path.join(APPS_DIR, `${id}.json`)
      const content = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(content) as App
    } catch (error) {
      return null
    }
  }

  static async createApp(name: string): Promise<App> {
    await ensureDirectoryExists(APPS_DIR)
    
    const id = uuidv4()
    const now = new Date().toISOString()
    
    const app: App = {
      id,
      name,
      createdAt: now,
      updatedAt: now
    }
    
    const filePath = path.join(APPS_DIR, `${id}.json`)
    await fs.writeFile(filePath, JSON.stringify(app, null, 2))
    
    return app
  }

  static async updateApp(id: string, name: string): Promise<App | null> {
    await ensureDirectoryExists(APPS_DIR)
    
    try {
      const filePath = path.join(APPS_DIR, `${id}.json`)
      const content = await fs.readFile(filePath, 'utf-8')
      const app = JSON.parse(content) as App
      
      app.name = name
      app.updatedAt = new Date().toISOString()
      
      await fs.writeFile(filePath, JSON.stringify(app, null, 2))
      return app
    } catch (error) {
      return null
    }
  }

  static async deleteApp(id: string): Promise<boolean> {
    await ensureDirectoryExists(APPS_DIR)
    
    try {
      const filePath = path.join(APPS_DIR, `${id}.json`)
      await fs.unlink(filePath)
      
      // 관련 릴리즈 노트도 삭제
      await ReleaseNoteDataManager.deleteAllByAppId(id)
      
      return true
    } catch (error) {
      return false
    }
  }
}

// 릴리즈 노트 데이터 관리
export class ReleaseNoteDataManager {
  static async getReleasesByAppId(appId: string): Promise<ReleaseNote[]> {
    await ensureDirectoryExists(RELEASES_DIR)
    
    try {
      const appReleasesDir = path.join(RELEASES_DIR, appId)
      await ensureDirectoryExists(appReleasesDir)
      
      const files = await fs.readdir(appReleasesDir)
      const releases: ReleaseNote[] = []
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(appReleasesDir, file)
          const content = await fs.readFile(filePath, 'utf-8')
          const release = JSON.parse(content) as ReleaseNote
          releases.push(release)
        }
      }
      
      return releases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (error) {
      console.error('Error reading releases:', error)
      return []
    }
  }

  static async getReleaseById(appId: string, releaseId: string): Promise<ReleaseNote | null> {
    await ensureDirectoryExists(RELEASES_DIR)
    
    try {
      const appReleasesDir = path.join(RELEASES_DIR, appId)
      const filePath = path.join(appReleasesDir, `${releaseId}.json`)
      const content = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(content) as ReleaseNote
    } catch (error) {
      return null
    }
  }

  static async createRelease(appId: string, releaseData: Omit<ReleaseNote, 'id' | 'publishHistory' | 'createdAt' | 'updatedAt'>): Promise<ReleaseNote> {
    await ensureDirectoryExists(RELEASES_DIR)
    
    const id = uuidv4()
    const now = new Date().toISOString()
    
    const release: ReleaseNote = {
      id,
      ...releaseData,
      publishHistory: [],
      createdAt: now,
      updatedAt: now
    }
    
    const appReleasesDir = path.join(RELEASES_DIR, appId)
    await ensureDirectoryExists(appReleasesDir)
    
    const filePath = path.join(appReleasesDir, `${id}.json`)
    await fs.writeFile(filePath, JSON.stringify(release, null, 2))
    
    return release
  }

  static async updateRelease(appId: string, releaseId: string, updateData: Partial<ReleaseNote>): Promise<ReleaseNote | null> {
    await ensureDirectoryExists(RELEASES_DIR)
    
    try {
      const appReleasesDir = path.join(RELEASES_DIR, appId)
      const filePath = path.join(appReleasesDir, `${releaseId}.json`)
      const content = await fs.readFile(filePath, 'utf-8')
      const release = JSON.parse(content) as ReleaseNote
      
      const updatedRelease = { 
        ...release, 
        ...updateData,
        updatedAt: new Date().toISOString()
      }
      await fs.writeFile(filePath, JSON.stringify(updatedRelease, null, 2))
      
      return updatedRelease
    } catch (error) {
      return null
    }
  }

  static async deleteRelease(appId: string, releaseId: string): Promise<boolean> {
    await ensureDirectoryExists(RELEASES_DIR)
    
    try {
      const appReleasesDir = path.join(RELEASES_DIR, appId)
      const filePath = path.join(appReleasesDir, `${releaseId}.json`)
      await fs.unlink(filePath)
      return true
    } catch (error) {
      return false
    }
  }

  static async deleteAllByAppId(appId: string): Promise<boolean> {
    await ensureDirectoryExists(RELEASES_DIR)
    
    try {
      const appReleasesDir = path.join(RELEASES_DIR, appId)
      const files = await fs.readdir(appReleasesDir)
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(appReleasesDir, file)
          await fs.unlink(filePath)
        }
      }
      
      return true
    } catch (error) {
      return false
    }
  }

  static async publishRelease(appId: string, releaseId: string, publisher: string): Promise<ReleaseNote | null> {
    await ensureDirectoryExists(RELEASES_DIR)
    
    try {
      const appReleasesDir = path.join(RELEASES_DIR, appId)
      const filePath = path.join(appReleasesDir, `${releaseId}.json`)
      const content = await fs.readFile(filePath, 'utf-8')
      const release = JSON.parse(content) as ReleaseNote
      
      const publishRecord = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        publisher,
        version: release.version
      }
      
      const updatedRelease: ReleaseNote = {
        ...release,
        isPublished: true,
        publishHistory: [publishRecord, ...release.publishHistory],
        updatedAt: new Date().toISOString()
      }
      
      await fs.writeFile(filePath, JSON.stringify(updatedRelease, null, 2))
      return updatedRelease
    } catch (error) {
      return null
    }
  }
}

// 앱과 릴리즈 노트를 함께 가져오는 헬퍼 함수
export async function getAppWithReleases(appId: string): Promise<AppWithReleases | null> {
  const app = await AppDataManager.getAppById(appId)
  if (!app) return null
  
  const releaseNotes = await ReleaseNoteDataManager.getReleasesByAppId(appId)
  
  return {
    ...app,
    releaseNotes
  }
}

export async function getAllAppsWithReleases(): Promise<AppWithReleases[]> {
  const apps = await AppDataManager.getAllApps()
  const appsWithReleases: AppWithReleases[] = []
  
  for (const app of apps) {
    const releaseNotes = await ReleaseNoteDataManager.getReleasesByAppId(app.id)
    appsWithReleases.push({
      ...app,
      releaseNotes
    })
  }
  
  return appsWithReleases
}
