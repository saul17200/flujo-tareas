import { registerEvent } from "@/features/events/services/events"

interface TaskEventContext {
  userId: string
  taskId: string
  title: string
  subjectName?: string | null
  dueDate?: string | null
}

export async function registerTaskCreatedEvent(
  context: TaskEventContext,
) {
  await registerEvent(context.userId, {
    type: "task-created",
    title: `Creaste la tarea: ${context.title}`,
    description: context.subjectName
      ? `Materia: ${context.subjectName}`
      : undefined,
    metadata: {
      taskId: context.taskId,
      subjectName: context.subjectName ?? null,
      dueDate: context.dueDate ?? null,
    },
  })
}

export async function registerTaskUpdatedEvent(
  context: TaskEventContext,
) {
  await registerEvent(context.userId, {
    type: "task-updated",
    title: `Actualizaste la tarea: ${context.title}`,
    description: context.subjectName
      ? `Materia: ${context.subjectName}`
      : undefined,
    metadata: {
      taskId: context.taskId,
      subjectName: context.subjectName ?? null,
      dueDate: context.dueDate ?? null,
    },
  })
}

export async function registerTaskCompletedEvent(
  context: TaskEventContext,
) {
  await registerEvent(context.userId, {
    type: "task-completed",
    title: `Completaste la tarea: ${context.title}`,
    description: context.subjectName
      ? `Materia: ${context.subjectName}`
      : undefined,
    metadata: {
      taskId: context.taskId,
      subjectName: context.subjectName ?? null,
      dueDate: context.dueDate ?? null,
    },
  })
}

export async function registerTaskDeletedEvent(
  context: TaskEventContext,
) {
  await registerEvent(context.userId, {
    type: "task-deleted",
    title: `Eliminaste la tarea: ${context.title}`,
    description: context.subjectName
      ? `Materia: ${context.subjectName}`
      : undefined,
    metadata: {
      taskId: context.taskId,
      subjectName: context.subjectName ?? null,
      dueDate: context.dueDate ?? null,
    },
  })
}
