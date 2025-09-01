import { NextRequest, NextResponse } from 'next/server'
import { ReleaseNoteDataManager, AppDataManager } from '@/lib/data-utils'
import { UpdateReleaseNoteRequest, PublishReleaseNoteRequest } from '@/lib/types'

interface RouteParams {
  params: {
    id: string
    releaseId: string
  }
}

// GET /api/apps/[id]/releases/[releaseId] - 특정 릴리즈 노트 조회
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
    
    const release = await ReleaseNoteDataManager.getReleaseById(params.id, params.releaseId)
    
    if (!release) {
      return NextResponse.json(
        { error: 'Release not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(release)
  } catch (error) {
    console.error('Error fetching release:', error)
    return NextResponse.json(
      { error: 'Failed to fetch release' },
      { status: 500 }
    )
  }
}

// PUT /api/apps/[id]/releases/[releaseId] - 릴리즈 노트 수정
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // 앱이 존재하는지 확인
    const app = await AppDataManager.getAppById(params.id)
    if (!app) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      )
    }
    
    const body: UpdateReleaseNoteRequest = await request.json()
    
    // 기존 릴리즈 노트 조회
    const existingRelease = await ReleaseNoteDataManager.getReleaseById(params.id, params.releaseId)
    if (!existingRelease) {
      return NextResponse.json(
        { error: 'Release not found' },
        { status: 404 }
      )
    }
    
    // 발행된 릴리즈 노트는 수정 불가
    if (existingRelease.isPublished) {
      return NextResponse.json(
        { error: 'Cannot modify published release' },
        { status: 400 }
      )
    }
    
    // 타입 검증
    if (body.type && !['major', 'minor', 'patch'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Type must be major, minor, or patch' },
        { status: 400 }
      )
    }
    
    const updateData: Partial<typeof existingRelease> = {}
    
    if (body.version) updateData.version = body.version.trim()
    if (body.title) updateData.title = body.title.trim()
    if (body.content) updateData.content = body.content.trim()
    if (body.type) updateData.type = body.type
    
    const updatedRelease = await ReleaseNoteDataManager.updateRelease(params.id, params.releaseId, updateData)
    
    if (!updatedRelease) {
      return NextResponse.json(
        { error: 'Failed to update release' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(updatedRelease)
  } catch (error) {
    console.error('Error updating release:', error)
    return NextResponse.json(
      { error: 'Failed to update release' },
      { status: 500 }
    )
  }
}

// DELETE /api/apps/[id]/releases/[releaseId] - 릴리즈 노트 삭제
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // 앱이 존재하는지 확인
    const app = await AppDataManager.getAppById(params.id)
    if (!app) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      )
    }
    
    // 기존 릴리즈 노트 조회
    const existingRelease = await ReleaseNoteDataManager.getReleaseById(params.id, params.releaseId)
    if (!existingRelease) {
      return NextResponse.json(
        { error: 'Release not found' },
        { status: 404 }
      )
    }
    
    // 발행된 릴리즈 노트는 삭제 불가
    if (existingRelease.isPublished) {
      return NextResponse.json(
        { error: 'Cannot delete published release' },
        { status: 400 }
      )
    }
    
    const success = await ReleaseNoteDataManager.deleteRelease(params.id, params.releaseId)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete release' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ message: 'Release deleted successfully' })
  } catch (error) {
    console.error('Error deleting release:', error)
    return NextResponse.json(
      { error: 'Failed to delete release' },
      { status: 500 }
    )
  }
}

// POST /api/apps/[id]/releases/[releaseId]/publish - 릴리즈 노트 발행
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
    
    const body: PublishReleaseNoteRequest = await request.json()
    
    if (!body.publisher || body.publisher.trim().length === 0) {
      return NextResponse.json(
        { error: 'Publisher name is required' },
        { status: 400 }
      )
    }
    
    const publishedRelease = await ReleaseNoteDataManager.publishRelease(
      params.id,
      params.releaseId,
      body.publisher.trim()
    )
    
    if (!publishedRelease) {
      return NextResponse.json(
        { error: 'Release not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(publishedRelease)
  } catch (error) {
    console.error('Error publishing release:', error)
    return NextResponse.json(
      { error: 'Failed to publish release' },
      { status: 500 }
    )
  }
}
