import {
  emitFileUpdatedEvent,
} from "@/features/events"
import {
  updateSubjectFile,
} from "@/features/files/services/subject-files"
import type {
  SubjectFile,
} from "@/features/files/types/subject-file"

interface UpdateFileAndEmitInput {
  userId: string
  planId: string
  courseId: string
  subjectFile: SubjectFile
  changes: {
    name?: string
    description?: string
    favorite?: boolean
  }
}

export async function updateFileAndEmit({
  userId,
  planId,
  courseId,
  subjectFile,
  changes,
}: UpdateFileAndEmitInput) {
  await updateSubjectFile(
    userId,
    planId,
    courseId,
    subjectFile.id,
    changes,
  )

  emitFileUpdatedEvent({
    userId,
    planId,
    courseId,
    fileId: subjectFile.id,
    name:
      changes.name?.trim() ||
      subjectFile.name,
    mimeType: subjectFile.mimeType,
    size: subjectFile.size,
  })
}
