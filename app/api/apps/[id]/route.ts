import { NextRequest, NextResponse } from 'next/server'
import { AppDataManager, getAppWithReleases } from '@/lib/data-utils'
import { UpdateAppRequest } from '@/lib/types'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/apps/[id] - 특정 앱 조회
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const app = await getAppWithReleases(params.id)
    
    if (!app) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(app)
  } catch (error) {
    console.error('Error fetching app:', error)
    return NextResponse.json(
      { error: 'Failed to fetch app' },
      { status: 500 }
    )
  }
}

// PUT /api/apps/[id] - 앱 정보 수정
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body: UpdateAppRequest = await request.json()
    
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'App name is required' },
        { status: 400 }
      )
    }
    
    const app = await AppDataManager.updateApp(params.id, body.name.trim())
    
    if (!app) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(app)
  } catch (error) {
    console.error('Error updating app:', error)
    return NextResponse.json(
      { error: 'Failed to update app' },
      { status: 500 }
    )
  }
}

// DELETE /api/apps/[id] - 앱 삭제
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const success = await AppDataManager.deleteApp(params.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'App deleted successfully' })
  } catch (error) {
    console.error('Error deleting app:', error)
    return NextResponse.json(
      { error: 'Failed to delete app' },
      { status: 500 }
    )
  }
}
