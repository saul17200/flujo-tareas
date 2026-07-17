import {
  useEffect,
  useRef,
  useState,
} from "react"
import { toast } from "sonner"

import { NoteEditor } from "@/features/notes/components/note-editor"
import { NoteList } from "@/features/notes/components/note-list"
import { useAuth } from "@/features/auth/auth-provider"
import {
  emitNoteCreatedEvent,
  emitNoteDeletedEvent,
  emitNoteUpdatedEvent,
} from "@/features/events"
import {
  createSubjectNote,
  observeSubjectNotes,
  removeSubjectNote,
  updateSubjectNote,
} from "@/features/notes/services/subject-notes"
import type { SubjectNote } from "@/features/notes/types/subject-note"

interface SubjectNotesProps {
  planId: string
  courseId: string
}

export function SubjectNotes({
  planId,
  courseId,
}: SubjectNotesProps) {
  const { user } = useAuth()
  const titleInputReference =
    useRef<HTMLInputElement>(null)

  const [notes, setNotes] =
    useState<SubjectNote[]>([])
  const [selectedNoteId, setSelectedNoteId] =
    useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const selectedNote =
    notes.find(
      (note) => note.id === selectedNoteId,
    ) ?? null

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

        if (
          selectedNoteId &&
          !nextNotes.some(
            (note) =>
              note.id === selectedNoteId,
          )
        ) {
          setSelectedNoteId(null)
          setTitle("")
          setContent("")
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
  }, [
    courseId,
    planId,
    selectedNoteId,
    user,
  ])

  function focusEditor() {
    window.requestAnimationFrame(() => {
      titleInputReference.current?.focus()
      titleInputReference.current?.scrollIntoView({
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
      toast.error(
        "Escribe un título para la nota.",
      )
      titleInputReference.current?.focus()
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

        emitNoteUpdatedEvent({
          userId: user.uid,
          planId,
          courseId,
          noteId: selectedNoteId,
          title: cleanTitle,
        })

        toast.success(
          "Nota actualizada correctamente.",
        )
      } else {
        const noteId = await createSubjectNote(
          user.uid,
          planId,
          courseId,
          {
            title: cleanTitle,
            content: cleanContent,
          },
        )

        emitNoteCreatedEvent({
          userId: user.uid,
          planId,
          courseId,
          noteId,
          title: cleanTitle,
        })

        toast.success(
          "Nota creada correctamente.",
        )
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
        firebaseError.code ===
          "permission-denied"
          ? "Firestore no permite guardar esta nota."
          : firebaseError.message ??
              "No fue posible guardar la nota.",
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(
    note: SubjectNote,
  ) {
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

      emitNoteDeletedEvent({
        userId: user.uid,
        planId,
        courseId,
        noteId: note.id,
        title: note.title,
      })

      if (selectedNoteId === note.id) {
        resetEditor()
      }

      toast.success("Nota eliminada.")
    } catch (error) {
      console.error(error)

      toast.error(
        "No fue posible eliminar la nota.",
      )
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <NoteList
        notes={notes}
        selectedNoteId={selectedNoteId}
        loading={loading}
        onCreate={startNewNote}
        onEdit={startEditing}
        onDelete={(note) =>
          void handleDelete(note)
        }
      />

      <NoteEditor
        ref={titleInputReference}
        editing={selectedNote !== null}
        title={title}
        content={content}
        saving={saving}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onClear={resetEditor}
        onSave={() =>
          void handleSaveNote()
        }
      />
    </section>
  )
}
