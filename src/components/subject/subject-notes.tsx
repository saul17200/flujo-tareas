import {
  useEffect,
  useRef,
  useState,
} from "react"
import {
  FileText,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/features/auth/auth-provider"
import {
  createSubjectNote,
  observeSubjectNotes,
  removeSubjectNote,
  updateSubjectNote,
} from "@/services/subject-notes"
import type { SubjectNote } from "@/types/subject-note"

interface SubjectNotesProps {
  planId: string
  courseId: string
}

function formatNoteDate(date: string) {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return "Fecha desconocida"
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate)
}

export function SubjectNotes({
  planId,
  courseId,
}: SubjectNotesProps) {
  const { user } = useAuth()
  const titleInputRef = useRef<HTMLInputElement>(null)

  const [notes, setNotes] = useState<SubjectNote[]>([])
  const [selectedNoteId, setSelectedNoteId] =
    useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const selectedNote =
    notes.find((note) => note.id === selectedNoteId) ??
    null

  useEffect(() => {
    if (!user) {
      setNotes([])
      setLoading(false)
      return
    }

    setLoading(true)

    return observeSubjectNotes(
      user.uid,
      planId,
      courseId,
      (nextNotes) => {
        setNotes(nextNotes)
        setLoading(false)

        if (selectedNoteId) {
          const updatedSelectedNote = nextNotes.find(
            (note) => note.id === selectedNoteId,
          )

          if (!updatedSelectedNote) {
            resetEditor()
          }
        }
      },
      (error) => {
        console.error(error)
        setLoading(false)
        toast.error(
          "No fue posible cargar las notas.",
        )
      },
    )
  }, [courseId, planId, selectedNoteId, user])

  function focusEditor() {
    window.requestAnimationFrame(() => {
      titleInputRef.current?.focus()
      titleInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    })
  }

  function resetEditor() {
    setSelectedNoteId(null)
    setTitle("")
    setContent("")
  }

  function startNewNote() {
    resetEditor()
    focusEditor()
  }

  function startEditing(note: SubjectNote) {
    setSelectedNoteId(note.id)
    setTitle(note.title)
    setContent(note.content)
    focusEditor()
  }

  async function handleSaveNote() {
    if (!user) {
      toast.error("No hay una sesión activa.")
      return
    }

    const cleanTitle = title.trim()
    const cleanContent = content.trim()

    if (!cleanTitle) {
      toast.error("Escribe un título para la nota.")
      titleInputRef.current?.focus()
      return
    }

    try {
      setSaving(true)

      if (selectedNoteId) {
        await updateSubjectNote(
          user.uid,
          planId,
          courseId,
          selectedNoteId,
          {
            title: cleanTitle,
            content: cleanContent,
          },
        )

        toast.success("Nota actualizada correctamente.")
      } else {
        await createSubjectNote(
          user.uid,
          planId,
          courseId,
          {
            title: cleanTitle,
            content: cleanContent,
          },
        )

        toast.success("Nota creada correctamente.")
      }

      resetEditor()
    } catch (error) {
      console.error(
        "Error al guardar la nota:",
        error,
      )

      const firebaseError = error as {
        code?: string
        message?: string
      }

      toast.error(
        firebaseError.code === "permission-denied"
          ? "Firestore no permite guardar esta nota."
          : firebaseError.message ??
              "No fue posible guardar la nota.",
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(note: SubjectNote) {
    if (!user) {
      return
    }

    const confirmed = window.confirm(
      `¿Eliminar la nota "${note.title}"?`,
    )

    if (!confirmed) {
      return
    }

    try {
      await removeSubjectNote(
        user.uid,
        planId,
        courseId,
        note.id,
      )

      if (selectedNoteId === note.id) {
        resetEditor()
      }

      toast.success("Nota eliminada.")
    } catch (error) {
      console.error(error)
      toast.error("No fue posible eliminar la nota.")
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Notas</CardTitle>

              <CardDescription>
                {notes.length === 1
                  ? "1 nota guardada"
                  : `${notes.length} notas guardadas`}
              </CardDescription>
            </div>

            <Button
              type="button"
              size="icon"
              onClick={startNewNote}
              aria-label="Crear nota"
              title="Nueva nota"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[480px] pr-3">
            {loading ? (
              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                Cargando notas...
              </div>
            ) : notes.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed text-center">
                <FileText className="size-8 text-muted-foreground" />

                <p className="mt-3 font-medium">
                  No hay notas
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Crea el primer apunte de esta materia.
                </p>
              </div>
            ) : (
              <div className="grid gap-2">
                {notes.map((note) => {
                  const active =
                    note.id === selectedNoteId

                  return (
                    <article
                      key={note.id}
                      className={[
                        "rounded-xl border p-3 transition-colors",
                        active
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/40",
                      ].join(" ")}
                    >
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={() =>
                          startEditing(note)
                        }
                      >
                        <p className="truncate font-medium">
                          {note.title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {note.content ||
                            "Nota sin contenido"}
                        </p>

                        <p className="mt-2 text-xs text-muted-foreground">
                          Actualizada{" "}
                          {formatNoteDate(note.updatedAt)}
                        </p>
                      </button>

                      <div className="mt-3 flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            startEditing(note)
                          }
                          aria-label={`Editar ${note.title}`}
                        >
                          <Pencil className="size-4" />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            void handleDelete(note)
                          }
                          aria-label={`Eliminar ${note.title}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedNote
              ? "Editar nota"
              : "Nueva nota"}
          </CardTitle>

          <CardDescription>
            {selectedNote
              ? "Modifica el contenido y guarda los cambios."
              : "Guarda apuntes, resúmenes, enlaces o recordatorios."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="note-title">
                Título
              </Label>

              <Input
                ref={titleInputRef}
                id="note-title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Unidad 1: Introducción"
                maxLength={120}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="note-content">
                Contenido
              </Label>

              <Textarea
                id="note-content"
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                placeholder="Escribe tus apuntes..."
                className="min-h-[340px] resize-y"
                maxLength={20000}
              />

              <p className="text-right text-xs text-muted-foreground">
                {content.length}/20000
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={resetEditor}
                disabled={saving}
              >
                <X className="size-4" />
                {selectedNote ? "Cancelar edición" : "Limpiar"}
              </Button>

              <button
                type="button"
                disabled={saving}
                onClick={() => void handleSaveNote()}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:pointer-events-none disabled:opacity-50"
              >
                <Save className="size-4" />

                {saving
                  ? "Guardando..."
                  : selectedNote
                    ? "Guardar cambios"
                    : "Crear nota"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
