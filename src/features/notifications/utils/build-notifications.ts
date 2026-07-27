import type {
  UserEvent,
} from "@/features/events"
import type {
  AppNotification,
  NotificationKind,
} from "@/features/notifications/types/notification"
import type {
  Task,
} from "@/types/task"

interface BuildNotificationsInput {
  tasks: Task[]
  events: UserEvent[]
  readIds: Set<string>
}

function parseDate(value: string | null) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? null
    : date
}

function getEventKind(
  event: UserEvent,
): NotificationKind {
  if (event.type.startsWith("task-")) {
    return "task"
  }

  if (event.type.startsWith("note-")) {
    return "note"
  }

  if (event.type.startsWith("file-")) {
    return "file"
  }

  if (
    event.type.startsWith("course-") ||
    event.type === "grade-updated" ||
    event.type === "plan-imported"
  ) {
    return "academic"
  }

  return "activity"
}

function getEventDestination(
  event: UserEvent,
) {
  const planId =
    typeof event.metadata?.planId === "string"
      ? event.metadata.planId
      : null

  const courseId =
    typeof event.metadata?.courseId === "string"
      ? event.metadata.courseId
      : null

  if (planId && courseId) {
    return `/carrera/${planId}/materia/${courseId}`
  }

  if (
    event.type === "achievement-unlocked" ||
    event.type === "level-up"
  ) {
    return "/logros"
  }

  if (
    event.type.startsWith("task-")
  ) {
    return "/tareas"
  }

  if (
    event.type.startsWith("course-") ||
    event.type === "grade-updated" ||
    event.type === "plan-imported"
  ) {
    return "/carrera"
  }

  return undefined
}

function buildTaskNotifications(
  tasks: Task[],
  readIds: Set<string>,
) {
  const now = new Date()

  const nextSevenDays = new Date(now)
  nextSevenDays.setDate(
    nextSevenDays.getDate() + 7,
  )

  return tasks
    .filter(
      (task) =>
        task.status !== "completed",
    )
    .map((task): AppNotification | null => {
      const dueDate =
        parseDate(task.dueDate)

      if (
        !dueDate ||
        dueDate > nextSevenDays
      ) {
        return null
      }

      const difference =
        dueDate.getTime() - now.getTime()

      const hoursRemaining =
        difference / (60 * 60 * 1000)

      const notificationId =
        `task-due-${task.id}`

      const overdue =
        hoursRemaining < 0

      const dueSoon =
        hoursRemaining >= 0 &&
        hoursRemaining <= 24

      let description = "Vence esta semana"

      if (overdue) {
        description = "La fecha de entrega ya pasó"
      } else if (dueSoon) {
        description =
          "Vence durante las próximas 24 horas"
      }

      if (task.subjectName) {
        description +=
          ` · ${task.subjectName}`
      }

      return {
        id: notificationId,
        kind: "task",
        urgency:
          overdue || dueSoon
            ? "urgent"
            : "important",
        title: overdue
          ? `Tarea atrasada: ${task.title}`
          : `Próxima entrega: ${task.title}`,
        description,
        createdAt: dueDate.toISOString(),
        destination: "/tareas",
        sourceId: task.id,
        read: readIds.has(
          notificationId,
        ),
      }
    })
    .filter(
      (
        notification,
      ): notification is AppNotification =>
        notification !== null,
    )
}

function buildEventNotifications(
  events: UserEvent[],
  readIds: Set<string>,
) {
  return events.map(
    (event): AppNotification => {
      const notificationId =
        `event-${event.id}`

      return {
        id: notificationId,
        kind: getEventKind(event),
        urgency:
          event.type === "course-failed"
            ? "important"
            : "normal",
        title: event.title,
        description:
          event.description,
        createdAt: event.createdAt,
        destination:
          getEventDestination(event),
        sourceId: event.id,
        read: readIds.has(
          notificationId,
        ),
      }
    },
  )
}

export function buildNotifications({
  tasks,
  events,
  readIds,
}: BuildNotificationsInput) {
  const notifications = [
    ...buildTaskNotifications(
      tasks,
      readIds,
    ),
    ...buildEventNotifications(
      events,
      readIds,
    ),
  ]

  const uniqueNotifications =
    new Map<string, AppNotification>()

  for (const notification of notifications) {
    uniqueNotifications.set(
      notification.id,
      notification,
    )
  }

  return [
    ...uniqueNotifications.values(),
  ].sort((first, second) => {
    if (
      first.read !== second.read
    ) {
      return first.read ? 1 : -1
    }

    return (
      new Date(second.createdAt).getTime() -
      new Date(first.createdAt).getTime()
    )
  })
}
