import { NextRequest, NextResponse } from 'next/server'
import { AppDataManager, getAllAppsWithReleases } from '@/lib/data-utils'
import { CreateAppRequest } from '@/lib/types'

// GET /api/apps - 모든 앱 목록 조회
export async function GET() {
  try {
    const apps = await getAllAppsWithReleases()
    return NextResponse.json(apps)
  } catch (error) {
    console.error('Error fetching apps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch apps' },
      { status: 500 }
    )
  }
}

// POST /api/apps - 새 앱 생성
export async function POST(request: NextRequest) {
  try {
    const body: CreateAppRequest = await request.json()
    
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'App name is required' },
        { status: 400 }
      )
    }
    
    const app = await AppDataManager.createApp(body.name.trim())
    return NextResponse.json(app, { status: 201 })
  } catch (error) {
    console.error('Error creating app:', error)
    return NextResponse.json(
      { error: 'Failed to create app' },
      { status: 500 }
    )
  }
}
