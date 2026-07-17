export type EventType =
  | "task-created"
  | "task-completed"
  | "task-updated"
  | "task-deleted"
  | "note-created"
  | "note-updated"
  | "note-deleted"
  | "file-uploaded"
  | "file-deleted"
  | "course-passed"
  | "course-failed"
  | "grade-updated"
  | "plan-imported"

export interface UserEvent {
  id: string

  type: EventType

  title: string

  description?: string

  createdAt: string

  metadata?: Record<string, unknown>
}
