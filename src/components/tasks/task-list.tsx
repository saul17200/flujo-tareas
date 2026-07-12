import { useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { TaskCard } from "@/components/tasks/task-card"
import { useTaskStore } from "@/store/task-store"
import type { Task, TaskStatus } from "@/types/task"

interface TaskSectionProps {
  title: string
  status: TaskStatus
  tasks: Task[]
}

function TaskSection({
  title,
  status,
  tasks,
}: TaskSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        <span className="rounded-full bg-muted px-3 py-1 text-sm">
          {tasks.length}
        </span>
      </div>

      <motion.div layout className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div
              key={`${status}-empty`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"
            >
              No hay tareas que coincidan.
            </motion.div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

export function TaskList() {
  const allTasks = useTaskStore(
    (state) => state.tasks,
  )
  const search = useTaskStore(
    (state) => state.search,
  )
  const statusFilter = useTaskStore(
    (state) => state.statusFilter,
  )
  const priorityFilter = useTaskStore(
    (state) => state.priorityFilter,
  )

  const filteredTasks = useMemo(() => {
    const cleanSearch = search
      .trim()
      .toLocaleLowerCase("es")

    return allTasks.filter((task) => {
      const matchesSearch =
        cleanSearch === "" ||
        task.title
          .toLocaleLowerCase("es")
          .includes(cleanSearch) ||
        task.description
          .toLocaleLowerCase("es")
          .includes(cleanSearch)

      const matchesStatus =
        statusFilter === "all" ||
        task.status === statusFilter

      const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      )
    })
  }, [
    allTasks,
    search,
    statusFilter,
    priorityFilter,
  ])

  const pendingTasks = useMemo(
    () =>
      filteredTasks.filter(
        (task) => task.status === "pending",
      ),
    [filteredTasks],
  )

  const completedTasks = useMemo(
    () =>
      filteredTasks.filter(
        (task) => task.status === "completed",
      ),
    [filteredTasks],
  )

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <TaskSection
        title="Pendientes"
        status="pending"
        tasks={pendingTasks}
      />

      <TaskSection
        title="Completadas"
        status="completed"
        tasks={completedTasks}
      />
    </div>
  )
}
