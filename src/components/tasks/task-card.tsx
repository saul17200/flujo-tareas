import { motion } from "framer-motion"
import {
  CalendarDays,
  Trash2,
  TriangleAlert,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useTaskStore } from "@/store/task-store"
import type { Task, TaskPriority } from "@/types/task"

interface TaskCardProps {
  task: Task
}

const priorityLabels: Record<TaskPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
}

const priorityVariants: Record<
  TaskPriority,
  "secondary" | "default" | "destructive"
> = {
  low: "secondary",
  medium: "default",
  high: "destructive",
}

function parseDate(dateKey: string) {
  return new Date(`${dateKey}T12:00:00`)
}

function formatDate(dateKey: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseDate(dateKey))
}

function isOverdue(task: Task) {
  if (!task.dueDate || task.status === "completed") {
    return false
  }

  const dueDate = parseDate(task.dueDate)
  dueDate.setHours(23, 59, 59, 999)

  return dueDate.getTime() < Date.now()
}

export function TaskCard({ task }: TaskCardProps) {
  const toggleTask = useTaskStore(
    (state) => state.toggleTask,
  )
  const deleteTask = useTaskStore(
    (state) => state.deleteTask,
  )

  const completed = task.status === "completed"
  const overdue = isOverdue(task)

  function handleToggle() {
    toggleTask(task.id)

    if (completed) {
      toast.info("Tarea marcada como pendiente", {
        description: task.title,
      })
    } else {
      toast.success("Tarea completada", {
        description: task.title,
      })
    }
  }

  function handleDelete() {
    deleteTask(task.id)

    toast.success("Tarea eliminada", {
      description: task.title,
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={
          completed
            ? "opacity-60"
            : overdue
              ? "border-destructive/60"
              : ""
        }
      >
        <CardHeader className="flex flex-row items-start gap-3 space-y-0">
          <Checkbox
            checked={completed}
            onCheckedChange={handleToggle}
            aria-label={`Cambiar estado de ${task.title}`}
          />

          <div className="min-w-0 flex-1">
            <CardTitle
              className={
                completed
                  ? "break-words text-base line-through"
                  : "break-words text-base"
              }
            >
              {task.title}
            </CardTitle>

            <div className="mt-2 flex flex-wrap gap-2">
              <Badge
                variant={priorityVariants[task.priority]}
              >
                Prioridad {priorityLabels[task.priority]}
              </Badge>

              {overdue && (
                <Badge variant="destructive">
                  <TriangleAlert className="size-3" />
                  Vencida
                </Badge>
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            aria-label={`Eliminar ${task.title}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </CardHeader>

        {(task.description || task.dueDate) && (
          <CardContent className="grid gap-3">
            {task.description && (
              <p className="break-words text-sm text-muted-foreground">
                {task.description}
              </p>
            )}

            {task.dueDate && (
              <div
                className={
                  overdue
                    ? "flex items-center gap-2 text-sm text-destructive"
                    : "flex items-center gap-2 text-sm text-muted-foreground"
                }
              >
                <CalendarDays className="size-4 shrink-0" />
                <span>
                  Fecha límite: {formatDate(task.dueDate)}
                </span>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}
