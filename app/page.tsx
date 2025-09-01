"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Plus, Save, X, Calendar, Trash2, FolderPlus, Send, History, Lock, Loader2 } from "lucide-react"
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
import { appApi, releaseApi } from "@/lib/api-client"
import { AppWithReleases, ReleaseNote } from "@/lib/types"

export default function ReleaseNotesApp() {
  const [apps, setApps] = useState<AppWithReleases[]>([])
  const [selectedAppId, setSelectedAppId] = useState<string>("")
  const [selectedNote, setSelectedNote] = useState<ReleaseNote | null>(null)
  const [editingContent, setEditingContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
    type: "minor" as "major" | "minor" | "patch",
  })

  const currentApp = apps.find((app) => app.id === selectedAppId)
  const currentReleaseNotes = currentApp?.releaseNotes || []

  // 데이터 로딩
  useEffect(() => {
    loadApps()
  }, [])

  const loadApps = async () => {
    try {
      setLoading(true)
      setError(null)
      const appsData = await appApi.getAll()
      setApps(appsData)
      
      if (appsData.length > 0) {
        setSelectedAppId(appsData[0].id)
        if (appsData[0].releaseNotes.length > 0) {
          setSelectedNote(appsData[0].releaseNotes[0])
        }
      }
    } catch (err) {
      setError('앱 목록을 불러오는데 실패했습니다.')
      console.error('Error loading apps:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshCurrentApp = async () => {
    if (selectedAppId) {
      try {
        const appData = await appApi.getById(selectedAppId)
        setApps(prevApps => 
          prevApps.map(app => app.id === selectedAppId ? appData : app)
        )
      } catch (err) {
        console.error('Error refreshing app:', err)
      }
    }
  }

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

  const handleAddNewApp = async () => {
    if (newAppName.trim()) {
      try {
        const newApp = await appApi.create({ name: newAppName.trim() })
        const appWithReleases = { ...newApp, releaseNotes: [] }
        setApps([...apps, appWithReleases])
        setSelectedAppId(newApp.id)
        setSelectedNote(null)
        setNewAppDialogOpen(false)
        setNewAppName("")
      } catch (err) {
        setError('앱 생성에 실패했습니다.')
        console.error('Error creating app:', err)
      }
    }
  }

  const handleEdit = () => {
    if (selectedNote) {
      setEditingContent(selectedNote.content)
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    if (selectedNote && currentApp) {
      try {
        const updatedRelease = await releaseApi.update(currentApp.id, selectedNote.id, {
          content: editingContent
        })

        setApps(prevApps =>
          prevApps.map((app) =>
            app.id === currentApp.id
              ? {
                  ...app,
                  releaseNotes: app.releaseNotes.map((note) =>
                    note.id === selectedNote.id ? updatedRelease : note,
                  ),
                }
              : app,
          )
        )
        setSelectedNote(updatedRelease)
        setIsEditing(false)
      } catch (err) {
        setError('릴리즈 노트 수정에 실패했습니다.')
        console.error('Error updating release:', err)
      }
    }
  }

  const handleCancel = () => {
    setEditingContent("")
    setIsEditing(false)
  }

  const handleCreateNew = () => {
    setIsCreating(true)
  }

  const handleSaveNew = async () => {
    if (newNote.version && newNote.title && newNote.content && currentApp) {
      try {
        const newReleaseNote = await releaseApi.create(currentApp.id, {
          version: newNote.version,
          title: newNote.title,
          content: newNote.content,
          type: newNote.type,
        })

        setApps(prevApps =>
          prevApps.map((app) =>
            app.id === currentApp.id ? { ...app, releaseNotes: [newReleaseNote, ...app.releaseNotes] } : app,
          )
        )
        setSelectedNote(newReleaseNote)
        setIsCreating(false)
        setNewNote({
          version: "",
          title: "",
          content: "",
          type: "minor" as "major" | "minor" | "patch",
        })
      } catch (err) {
        setError('릴리즈 노트 생성에 실패했습니다.')
        console.error('Error creating release:', err)
      }
    }
  }

  const handleCancelNew = () => {
    setIsCreating(false)
    setNewNote({
      version: "",
      title: "",
      content: "",
      type: "minor" as "major" | "minor" | "patch",
    })
  }

  const handleDeleteNote = (note: ReleaseNote) => {
    setNoteToDelete(note)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (noteToDelete && currentApp) {
      try {
        await releaseApi.delete(currentApp.id, noteToDelete.id)
        
        setApps(prevApps =>
          prevApps.map((app) =>
            app.id === currentApp.id
              ? { ...app, releaseNotes: app.releaseNotes.filter((note) => note.id !== noteToDelete.id) }
              : app,
          )
        )

        // 삭제된 노트가 현재 선택된 노트라면 다른 노트를 선택하거나 null로 설정
        if (selectedNote?.id === noteToDelete.id) {
          const updatedApp = apps.find((app) => app.id === currentApp.id)
          const remainingNotes = updatedApp?.releaseNotes.filter((note) => note.id !== noteToDelete.id) || []
          setSelectedNote(remainingNotes.length > 0 ? remainingNotes[0] : null)
        }

        setDeleteDialogOpen(false)
        setNoteToDelete(null)
      } catch (err) {
        setError('릴리즈 노트 삭제에 실패했습니다.')
        console.error('Error deleting release:', err)
      }
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

  const confirmPublish = async () => {
    if (selectedNote && currentApp && publisherName.trim()) {
      try {
        const publishedRelease = await releaseApi.publish(currentApp.id, selectedNote.id, {
          publisher: publisherName.trim()
        })

        setApps(prevApps =>
          prevApps.map((app) =>
            app.id === currentApp.id
              ? {
                  ...app,
                  releaseNotes: app.releaseNotes.map((note) =>
                    note.id === selectedNote.id ? publishedRelease : note,
                  ),
                }
              : app,
          )
        )
        setSelectedNote(publishedRelease)
        setPublishDialogOpen(false)
        setPublisherName("")
      } catch (err) {
        setError('릴리즈 노트 발행에 실패했습니다.')
        console.error('Error publishing release:', err)
      }
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

  if (loading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadApps}>다시 시도</Button>
        </div>
      </div>
    )
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
                      onChange={(e) => setNewNote({ ...newNote, type: e.target.value as "major" | "minor" | "patch" })}
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
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full min-h-[500px] font-mono"
                  />
                ) : (
                  <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 mt-8 text-foreground border-b border-border pb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 mt-6 text-foreground">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-bold mb-3 mt-4 text-foreground">{children}</h3>,
                        p: ({ children }) => <p className="mb-4 leading-relaxed text-foreground">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2 ml-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">{children}</ol>,
                        li: ({ children }) => <li className="text-foreground">{children}</li>,
                        strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                        em: ({ children }) => <em className="italic text-foreground">{children}</em>,
                        code: ({ children }) => <code className="bg-muted text-foreground px-2 py-1 rounded text-sm font-mono border">{children}</code>,
                        pre: ({ children }) => <pre className="bg-muted text-foreground p-4 rounded-lg overflow-x-auto mb-4 border font-mono text-sm">{children}</pre>,
                        blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-4 italic mb-4 bg-muted/50 p-4 rounded-r-lg">{children}</blockquote>,
                        hr: () => <hr className="my-8 border-border" />,
                      }}
                    >
                      {selectedNote.content}
                    </ReactMarkdown>
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
