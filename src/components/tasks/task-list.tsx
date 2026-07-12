import { useMemo } from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"

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
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: "column",
      status,
    },
  })

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

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <motion.div
          ref={setNodeRef}
          layout
          className={
            isOver
              ? "grid min-h-40 gap-4 rounded-xl bg-primary/5 p-2 ring-2 ring-primary/30"
              : "grid min-h-40 gap-4 rounded-xl p-2"
          }
        >
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
              <motion.div
                key={`${status}-empty`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-36 items-center justify-center rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"
              >
                Arrastra una tarea aquí.
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
      </SortableContext>
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
  const moveTask = useTaskStore(
    (state) => state.moveTask,
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over) {
      return
    }

    const activeId = String(active.id)
    const overId = String(over.id)

    const activeTask = allTasks.find(
      (task) => task.id === activeId,
    )

    if (!activeTask) {
      return
    }

    let targetStatus: TaskStatus

    if (
      overId === "pending" ||
      overId === "completed"
    ) {
      targetStatus = overId
    } else {
      const overTask = allTasks.find(
        (task) => task.id === overId,
      )

      if (!overTask) {
        return
      }

      targetStatus = overTask.status
    }

    if (
      activeId === overId &&
      activeTask.status === targetStatus
    ) {
      return
    }

    moveTask(activeId, overId, targetStatus)

    if (activeTask.status !== targetStatus) {
      toast.success(
        targetStatus === "completed"
          ? "Tarea movida a Completadas"
          : "Tarea movida a Pendientes",
        {
          description: activeTask.title,
        },
      )
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
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
    </DndContext>
  )
}
