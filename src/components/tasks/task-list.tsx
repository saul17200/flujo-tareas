import { useMemo } from "react"

import { TaskCard } from "@/components/tasks/task-card"
import { useTaskStore } from "@/store/task-store"
import type { TaskStatus } from "@/types/task"

interface TaskSectionProps {
  title: string
  status: TaskStatus
}

function TaskSection({ title, status }: TaskSectionProps) {
  const allTasks = useTaskStore((state) => state.tasks)

  const tasks = useMemo(
    () => allTasks.filter((task) => task.status === status),
    [allTasks, status],
  )

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>

        <span className="rounded-full bg-muted px-3 py-1 text-sm">
          {tasks.length}
        </span>
      </div>

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No hay tareas en esta sección.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </section>
  )
}

export function TaskList() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <TaskSection title="Pendientes" status="pending" />
      <TaskSection title="Completadas" status="completed" />
    </div>
  )
}
