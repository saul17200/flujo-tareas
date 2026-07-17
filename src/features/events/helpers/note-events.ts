import { emitUserEvent } from "@/features/events/utils/emit-user-event"

interface NoteEventContext {
  userId: string
  planId: string
  courseId: string
  noteId?: string
  title: string
}

export function emitNoteCreatedEvent(
  context: NoteEventContext,
) {
  emitUserEvent({
    userId: context.userId,
    type: "note-created",
    title: `Creaste la nota: ${context.title}`,
    metadata: {
      planId: context.planId,
      courseId: context.courseId,
      noteId: context.noteId ?? null,
    },
  })
}

export function emitNoteUpdatedEvent(
  context: NoteEventContext,
) {
  emitUserEvent({
    userId: context.userId,
    type: "note-updated",
    title: `Actualizaste la nota: ${context.title}`,
    metadata: {
      planId: context.planId,
      courseId: context.courseId,
      noteId: context.noteId ?? null,
    },
  })
}

export function emitNoteDeletedEvent(
  context: NoteEventContext,
) {
  emitUserEvent({
    userId: context.userId,
    type: "note-deleted",
    title: `Eliminaste la nota: ${context.title}`,
    metadata: {
      planId: context.planId,
      courseId: context.courseId,
      noteId: context.noteId ?? null,
    },
  })
}
