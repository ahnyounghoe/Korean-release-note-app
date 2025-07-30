"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Plus, Save, X, Calendar } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ReleaseNote {
  id: string
  version: string
  title: string
  date: string
  content: string
  type: "major" | "minor" | "patch"
}

const initialReleaseNotes: ReleaseNote[] = [
  {
    id: "1",
    version: "v2.1.0",
    title: "새로운 디자인 시스템 도입",
    date: "2024-01-15",
    content: `# v2.1.0 - 새로운 디자인 시스템 도입

## 🎨 새로운 기능
- **디자인 시스템 2.0**: 완전히 새로워진 UI/UX 디자인
- **다크 모드 지원**: 사용자 선호도에 따른 테마 전환
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험

## 🔧 개선사항
- 페이지 로딩 속도 30% 향상
- 접근성 개선 (WCAG 2.1 AA 준수)
- 모바일 터치 인터페이스 개선

## 🐛 버그 수정
- 사이드바 스크롤 이슈 해결
- 검색 기능 정확도 개선
- 메모리 누수 문제 해결`,
    type: "minor",
  },
  {
    id: "2",
    version: "v2.0.5",
    title: "성능 최적화 및 버그 수정",
    date: "2024-01-08",
    content: `# v2.0.5 - 성능 최적화 및 버그 수정

## 🔧 개선사항
- 데이터베이스 쿼리 최적화
- 캐싱 전략 개선
- 번들 크기 20% 감소

## 🐛 버그 수정
- 로그인 세션 만료 이슈 해결
- 파일 업로드 실패 문제 수정
- 알림 중복 표시 문제 해결`,
    type: "patch",
  },
  {
    id: "3",
    version: "v2.0.0",
    title: "메이저 업데이트 - 새로운 아키텍처",
    date: "2023-12-20",
    content: `# v2.0.0 - 메이저 업데이트

## 🚀 주요 변경사항
- **새로운 아키텍처**: 마이크로서비스 기반으로 전환
- **API v2**: RESTful API 완전 재설계
- **실시간 기능**: WebSocket 기반 실시간 업데이트

## ⚠️ 주요 변경사항 (Breaking Changes)
- API v1 지원 종료 (2024년 6월까지 지원)
- 구 버전 클라이언트 호환성 제거
- 데이터베이스 스키마 변경

## 🎯 새로운 기능
- 실시간 협업 기능
- 고급 분석 대시보드
- 사용자 권한 관리 시스템`,
    type: "major",
  },
]

export default function ReleaseNotesApp() {
  const [releaseNotes, setReleaseNotes] = useState<ReleaseNote[]>(initialReleaseNotes)
  const [selectedNote, setSelectedNote] = useState<ReleaseNote | null>(releaseNotes[0])
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editContent, setEditContent] = useState("")
  const [newNote, setNewNote] = useState({
    version: "",
    title: "",
    content: "",
    type: "minor" as const,
  })

  const handleEdit = () => {
    if (selectedNote) {
      setEditContent(selectedNote.content)
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    if (selectedNote) {
      const updatedNotes = releaseNotes.map((note) =>
        note.id === selectedNote.id ? { ...note, content: editContent } : note,
      )
      setReleaseNotes(updatedNotes)
      setSelectedNote({ ...selectedNote, content: editContent })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditContent("")
  }

  const handleCreateNew = () => {
    setIsCreating(true)
    setNewNote({
      version: "",
      title: "",
      content: "",
      type: "minor",
    })
  }

  const handleSaveNew = () => {
    if (newNote.version && newNote.title && newNote.content) {
      const newReleaseNote: ReleaseNote = {
        id: Date.now().toString(),
        version: newNote.version,
        title: newNote.title,
        date: new Date().toISOString().split("T")[0],
        content: newNote.content,
        type: newNote.type,
      }
      setReleaseNotes([newReleaseNote, ...releaseNotes])
      setSelectedNote(newReleaseNote)
      setIsCreating(false)
      setNewNote({
        version: "",
        title: "",
        content: "",
        type: "minor",
      })
    }
  }

  const handleCancelNew = () => {
    setIsCreating(false)
    setNewNote({
      version: "",
      title: "",
      content: "",
      type: "minor",
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "major":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "minor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "patch":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* 왼쪽 사이드바 - 릴리즈 노트 목록 */}
      <div className="w-80 border-r bg-muted/30">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">릴리즈 노트</h1>
            <Button size="sm" onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-1" />
              새로 만들기
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {releaseNotes.map((note) => (
              <Card
                key={note.id}
                className={`mb-2 cursor-pointer transition-colors hover:bg-accent ${
                  selectedNote?.id === note.id ? "bg-accent border-primary" : ""
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{note.version}</CardTitle>
                    <Badge className={`text-xs ${getTypeColor(note.type)}`}>{note.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{note.title}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {note.date}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 오른쪽 메인 영역 */}
      <div className="flex-1 flex flex-col">
        {isCreating ? (
          /* 새 릴리즈 노트 생성 */
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">새 릴리즈 노트 작성</h2>
                <div className="flex gap-2">
                  <Button onClick={handleSaveNew}>
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                  <Button variant="outline" onClick={handleCancelNew}>
                    <X className="w-4 h-4 mr-2" />
                    취소
                  </Button>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">버전</label>
                    <Input
                      placeholder="예: v2.1.0"
                      value={newNote.version}
                      onChange={(e) => setNewNote({ ...newNote, version: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">타입</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newNote.type}
                      onChange={(e) => setNewNote({ ...newNote, type: e.target.value as any })}
                    >
                      <option value="patch">Patch</option>
                      <option value="minor">Minor</option>
                      <option value="major">Major</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">제목</label>
                  <Input
                    placeholder="릴리즈 제목을 입력하세요"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">내용 (Markdown)</label>
                <Textarea
                  placeholder="릴리즈 노트 내용을 Markdown으로 작성하세요..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="min-h-[400px] font-mono"
                />
              </div>
            </div>
          </div>
        ) : selectedNote ? (
          <>
            {/* 헤더 */}
            <div className="border-b p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{selectedNote.version}</h1>
                      <Badge className={getTypeColor(selectedNote.type)}>{selectedNote.type}</Badge>
                    </div>
                    <p className="text-lg text-muted-foreground mb-2">{selectedNote.title}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {selectedNote.date}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          저장
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          <X className="w-4 h-4 mr-2" />
                          취소
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleEdit}>
                        <Edit className="w-4 h-4 mr-2" />
                        편집
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 본문 */}
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-4xl mx-auto">
                {isEditing ? (
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full min-h-[500px] font-mono"
                    placeholder="Markdown으로 내용을 작성하세요..."
                  />
                ) : (
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">릴리즈 노트를 선택하세요</h2>
              <p className="text-muted-foreground">왼쪽 목록에서 릴리즈 노트를 선택하여 내용을 확인하세요.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
