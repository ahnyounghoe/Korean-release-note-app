import { NextRequest, NextResponse } from 'next/server'
import { ReleaseNoteDataManager, AppDataManager } from '@/lib/data-utils'
import { CreateReleaseNoteRequest } from '@/lib/types'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/apps/[id]/releases - 특정 앱의 릴리즈 노트 목록 조회
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // 앱이 존재하는지 확인
    const app = await AppDataManager.getAppById(params.id)
    if (!app) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      )
    }
    
    const releases = await ReleaseNoteDataManager.getReleasesByAppId(params.id)
    return NextResponse.json(releases)
  } catch (error) {
    console.error('Error fetching releases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch releases' },
      { status: 500 }
    )
  }
}

// POST /api/apps/[id]/releases - 새 릴리즈 노트 생성
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // 앱이 존재하는지 확인
    const app = await AppDataManager.getAppById(params.id)
    if (!app) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      )
    }
    
    const body: CreateReleaseNoteRequest = await request.json()
    
    if (!body.version || !body.title || !body.content) {
      return NextResponse.json(
        { error: 'Version, title, and content are required' },
        { status: 400 }
      )
    }
    
    if (!['major', 'minor', 'patch'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Type must be major, minor, or patch' },
        { status: 400 }
      )
    }
    
    const releaseData = {
      version: body.version.trim(),
      title: body.title.trim(),
      content: body.content.trim(),
      type: body.type,
      date: new Date().toISOString().split('T')[0],
      isPublished: false
    }
    
    const release = await ReleaseNoteDataManager.createRelease(params.id, releaseData)
    return NextResponse.json(release, { status: 201 })
  } catch (error) {
    console.error('Error creating release:', error)
    return NextResponse.json(
      { error: 'Failed to create release' },
      { status: 500 }
    )
  }
}
