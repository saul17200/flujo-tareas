export type NotificationKind =
  | "task"
  | "note"
  | "file"
  | "academic"
  | "activity"

export type NotificationUrgency =
  | "normal"
  | "important"
  | "urgent"

export interface AppNotification {
  id: string
  kind: NotificationKind
  urgency: NotificationUrgency
  title: string
  description?: string
  createdAt: string
  destination?: string
  sourceId?: string
  read: boolean
}
