import { emitUserEvent } from "@/features/events/utils/emit-user-event"

interface FileEventContext {
  userId: string
  planId: string
  courseId: string
  fileId: string
  name: string
  mimeType?: string
  size?: number
}

export function emitFileUploadedEvent(
  context: FileEventContext,
) {
  emitUserEvent({
    userId: context.userId,
    type: "file-uploaded",
    title: `Subiste el archivo: ${context.name}`,
    metadata: {
      planId: context.planId,
      courseId: context.courseId,
      fileId: context.fileId,
      mimeType: context.mimeType ?? null,
      size: context.size ?? null,
    },
  })
}

export function emitFileUpdatedEvent(
  context: FileEventContext,
) {
  emitUserEvent({
    userId: context.userId,
    type: "file-updated",
    title: `Actualizaste el archivo: ${context.name}`,
    metadata: {
      planId: context.planId,
      courseId: context.courseId,
      fileId: context.fileId,
      mimeType: context.mimeType ?? null,
      size: context.size ?? null,
    },
  })
}

export function emitFileDeletedEvent(
  context: FileEventContext,
) {
  emitUserEvent({
    userId: context.userId,
    type: "file-deleted",
    title: `Eliminaste el archivo: ${context.name}`,
    metadata: {
      planId: context.planId,
      courseId: context.courseId,
      fileId: context.fileId,
      mimeType: context.mimeType ?? null,
      size: context.size ?? null,
    },
  })
}
