"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Plus, Save, X, Calendar, Trash2, FolderPlus, Send, History, Lock } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PublishHistory {
  id: string
  timestamp: string
  publisher: string
  version: string
}

interface ReleaseNote {
  id: string
  version: string
  title: string
  date: string
  content: string
  type: "major" | "minor" | "patch"
  isPublished: boolean
  publishHistory: PublishHistory[]
}

interface App {
  id: string
  name: string
  releaseNotes: ReleaseNote[]
}

const initialApps: App[] = [
  {
    id: "1",
    name: "리바이티엔",
    releaseNotes: [
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
        isPublished: true,
        publishHistory: [
          {
            id: "1",
            timestamp: "2024-01-15T10:30:00Z",
            publisher: "김개발",
            version: "v2.1.0",
          },
        ],
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
        isPublished: false,
        publishHistory: [],
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
        isPublished: true,
        publishHistory: [
          {
            id: "2",
            timestamp: "2023-12-20T14:15:00Z",
            publisher: "박매니저",
            version: "v2.0.0",
          },
          {
            id: "3",
            timestamp: "2023-12-21T09:20:00Z",
            publisher: "김개발",
            version: "v2.0.0",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "모바일 앱",
    releaseNotes: [
      {
        id: "4",
        version: "v1.2.0",
        title: "푸시 알림 기능 추가",
        date: "2024-01-10",
        content: `# v1.2.0 - 푸시 알림 기능 추가

## 🔔 새로운 기능
- **푸시 알림**: 실시간 알림 수신 기능
- **알림 설정**: 사용자 맞춤 알림 설정
- **배지 표시**: 읽지 않은 알림 개수 표시

## 🔧 개선사항
- 앱 시작 속도 개선
- 메모리 사용량 최적화`,
        type: "minor",
        isPublished: false,
        publishHistory: [],
      },
    ],
  },
]

export default function ReleaseNotesApp() {
  const [apps, setApps] = useState<App[]>(initialApps)
  const [selectedAppId, setSelectedAppId] = useState<string>(initialApps[0].id)
  const [selectedNote, setSelectedNote] = useState<ReleaseNote | null>(initialApps[0].releaseNotes[0])
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<ReleaseNote | null>(null)
  const [newAppDialogOpen, setNewAppDialogOpen] = useState(false)
  const [newAppName, setNewAppName] = useState("")
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [publisherName, setPublisherName] = useState("")
  const [newNote, setNewNote] = useState({
    version: "",
    title: "",
    content: "",
    type: "minor",
  })

  const currentApp = apps.find((app) => app.id === selectedAppId)
  const currentReleaseNotes = currentApp?.releaseNotes || []

  const handleAppChange = (appId: string) => {
    setSelectedAppId(appId)
    const app = apps.find((a) => a.id === appId)
    if (app && app.releaseNotes.length > 0) {
      setSelectedNote(app.releaseNotes[0])
    } else {
      setSelectedNote(null)
    }
    setIsEditing(false)
    setIsCreating(false)
  }

  const handleAddNewApp = () => {
    if (newAppName.trim()) {
      const newApp: App = {
        id: Date.now().toString(),
        name: newAppName.trim(),
        releaseNotes: [],
      }
      setApps([...apps, newApp])
      setSelectedAppId(newApp.id)
      setSelectedNote(null)
      setNewAppDialogOpen(false)
      setNewAppName("")
    }
  }

  const handleEdit = () => {
    if (selectedNote) {
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleCreateNew = () => {
    setIsCreating(true)
  }

  const handleSaveNew = () => {
    if (newNote.version && newNote.title && newNote.content && currentApp) {
      const newReleaseNote: ReleaseNote = {
        id: Date.now().toString(),
        version: newNote.version,
        title: newNote.title,
        date: new Date().toISOString().split("T")[0],
        content: newNote.content,
        type: newNote.type,
        isPublished: false,
        publishHistory: [],
      }

      const updatedApps = apps.map((app) =>
        app.id === currentApp.id ? { ...app, releaseNotes: [newReleaseNote, ...app.releaseNotes] } : app,
      )

      setApps(updatedApps)
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

  const handleDeleteNote = (note: ReleaseNote) => {
    setNoteToDelete(note)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (noteToDelete && currentApp) {
      const updatedApps = apps.map((app) =>
        app.id === currentApp.id
          ? { ...app, releaseNotes: app.releaseNotes.filter((note) => note.id !== noteToDelete.id) }
          : app,
      )
      setApps(updatedApps)

      // 삭제된 노트가 현재 선택된 노트라면 다른 노트를 선택하거나 null로 설정
      if (selectedNote?.id === noteToDelete.id) {
        const updatedApp = updatedApps.find((app) => app.id === currentApp.id)
        setSelectedNote(updatedApp && updatedApp.releaseNotes.length > 0 ? updatedApp.releaseNotes[0] : null)
      }

      setDeleteDialogOpen(false)
      setNoteToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setNoteToDelete(null)
  }

  const handlePublish = () => {
    setPublishDialogOpen(true)
    setPublisherName("")
  }

  const confirmPublish = () => {
    if (selectedNote && currentApp && publisherName.trim()) {
      const newPublishRecord: PublishHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        publisher: publisherName.trim(),
        version: selectedNote.version,
      }

      const updatedApps = apps.map((app) =>
        app.id === currentApp.id
          ? {
              ...app,
              releaseNotes: app.releaseNotes.map((note) =>
                note.id === selectedNote.id
                  ? {
                      ...note,
                      isPublished: true,
                      publishHistory: [newPublishRecord, ...note.publishHistory],
                    }
                  : note,
              ),
            }
          : app,
      )

      setApps(updatedApps)
      setSelectedNote({
        ...selectedNote,
        isPublished: true,
        publishHistory: [newPublishRecord, ...selectedNote.publishHistory],
      })
      setPublishDialogOpen(false)
      setPublisherName("")
    }
  }

  const cancelPublish = () => {
    setPublishDialogOpen(false)
    setPublisherName("")
  }

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
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
            <div className="flex items-center gap-2 flex-1">
              <Select value={selectedAppId} onValueChange={handleAppChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="앱 선택" />
                </SelectTrigger>
                <SelectContent>
                  {apps.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={() => setNewAppDialogOpen(true)} className="shrink-0">
                <FolderPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button size="sm" onClick={handleCreateNew} className="w-full">
            <Plus className="w-4 h-4 mr-1" />새 릴리즈 노트
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {currentReleaseNotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">릴리즈 노트가 없습니다.</p>
                <p className="text-xs mt-1">새 릴리즈 노트를 작성해보세요.</p>
              </div>
            ) : (
              currentReleaseNotes.map((note) => (
                <Card
                  key={note.id}
                  className={`mb-2 cursor-pointer transition-colors hover:bg-accent group ${
                    selectedNote?.id === note.id ? "bg-accent border-primary" : ""
                  }`}
                  onClick={() => setSelectedNote(note)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-medium">{note.version}</CardTitle>
                        {note.isPublished && <Lock className="w-3 h-3 text-green-600" />}
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge className={`text-xs ${getTypeColor(note.type)}`}>{note.type}</Badge>
                        {note.isPublished && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            발행됨
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteNote(note)
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{note.title}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {note.date}
                      </div>
                      {note.publishHistory.length > 0 && (
                        <div className="text-xs text-muted-foreground">발행 {note.publishHistory.length}회</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
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
                      {selectedNote.isPublished && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Lock className="w-3 h-3 mr-1" />
                          발행됨
                        </Badge>
                      )}
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
                        <Button onClick={handleSaveNew}>
                          <Save className="w-4 h-4 mr-2" />
                          저장
                        </Button>
                        <Button variant="outline" onClick={handleCancelNew}>
                          <X className="w-4 h-4 mr-2" />
                          취소
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={handleEdit} disabled={selectedNote.isPublished}>
                          <Edit className="w-4 h-4 mr-2" />
                          편집
                        </Button>
                        {!selectedNote.isPublished && (
                          <Button onClick={handlePublish}>
                            <Send className="w-4 h-4 mr-2" />
                            발행
                          </Button>
                        )}
                        {selectedNote.publishHistory.length > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline">
                                <History className="w-4 h-4 mr-2" />
                                발행 이력 ({selectedNote.publishHistory.length})
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                              <DropdownMenuLabel>발행 이력</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {selectedNote.publishHistory.map((history, index) => (
                                <DropdownMenuItem key={history.id} className="flex flex-col items-start p-3">
                                  <div className="flex items-center justify-between w-full">
                                    <span className="font-medium">{history.publisher}</span>
                                    <Badge variant="outline" className="text-xs">
                                      #{selectedNote.publishHistory.length - index}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {formatDateTime(history.timestamp)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">버전: {history.version}</div>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </>
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
                    placeholder="Markdown으로 내용을 작성하세요..."
                    value={selectedNote.content}
                    onChange={(e) =>
                      setApps((prevApps) =>
                        prevApps.map((app) =>
                          app.id === currentApp?.id
                            ? {
                                ...app,
                                releaseNotes: app.releaseNotes.map((note) =>
                                  note.id === selectedNote.id ? { ...note, content: e.target.value } : note,
                                ),
                              }
                            : app,
                        ),
                      )
                    }
                    className="w-full min-h-[500px] font-mono"
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
              <h2 className="text-xl font-semibold mb-2">
                {currentApp ? "릴리즈 노트를 선택하거나 새로 작성하세요" : "앱을 선택하세요"}
              </h2>
              <p className="text-muted-foreground">
                {currentApp
                  ? "왼쪽 목록에서 릴리즈 노트를 선택하거나 새 릴리즈 노트를 작성해보세요."
                  : "상단에서 앱을 선택하거나 새 앱을 추가해보세요."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 새 앱 추가 다이얼로그 */}
      <Dialog open={newAppDialogOpen} onOpenChange={setNewAppDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 앱 추가</DialogTitle>
            <DialogDescription>새로운 앱의 릴리즈 노트를 관리하기 위해 앱 이름을 입력하세요.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="앱 이름을 입력하세요"
              value={newAppName}
              onChange={(e) => setNewAppName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddNewApp()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewAppDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddNewApp} disabled={!newAppName.trim()}>
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 발행 다이얼로그 */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>릴리즈 노트 발행</DialogTitle>
            <DialogDescription>
              릴리즈 노트를 발행하면 조회 전용으로 변경되며 편집할 수 없습니다. 발행자 이름을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">발행자</label>
            <Input
              placeholder="발행자 이름을 입력하세요"
              value={publisherName}
              onChange={(e) => setPublisherName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  confirmPublish()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelPublish}>
              취소
            </Button>
            <Button onClick={confirmPublish} disabled={!publisherName.trim()}>
              <Send className="w-4 h-4 mr-2" />
              발행
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>릴리즈 노트 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 "{noteToDelete?.version} - {noteToDelete?.title}" 릴리즈 노트를 삭제하시겠습니까?
              <br />이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
