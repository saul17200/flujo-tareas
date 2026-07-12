import { Trash2 } from "lucide-react"

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

export function TaskCard({ task }: TaskCardProps) {
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)

  const completed = task.status === "completed"

  return (
    <Card className={completed ? "opacity-60" : ""}>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <Checkbox
          checked={completed}
          onCheckedChange={() => toggleTask(task.id)}
          aria-label={`Marcar ${task.title} como completada`}
        />

        <div className="min-w-0 flex-1">
          <CardTitle
            className={
              completed
                ? "text-base line-through"
                : "text-base"
            }
          >
            {task.title}
          </CardTitle>

          <Badge
            variant={priorityVariants[task.priority]}
            className="mt-2"
          >
            Prioridad {priorityLabels[task.priority]}
          </Badge>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => deleteTask(task.id)}
          aria-label={`Eliminar ${task.title}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </CardHeader>

      {task.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {task.description}
          </p>
        </CardContent>
      )}
    </Card>
  )
}
