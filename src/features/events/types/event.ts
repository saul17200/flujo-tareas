export type EventType =
  | "task-created"
  | "task-completed"
  | "task-updated"
  | "task-deleted"
  | "note-created"
  | "note-updated"
  | "note-deleted"
  | "file-uploaded"
  | "file-updated"
  | "file-deleted"
  | "course-passed"
  | "course-failed"
  | "course-updated"
  | "grade-updated"
  | "plan-imported"
  | "study-session-started"
  | "study-session-completed"

export interface UserEvent {
  id: string
  type: EventType
  title: string
  description?: string
  createdAt: string
  metadata?: Record<string, unknown>
}

export interface RegisterEventInput {
  type: EventType
  title: string
  description?: string
  metadata?: Record<string, unknown>
}

export interface EventBusPayload
  extends RegisterEventInput {
  userId: string
}
