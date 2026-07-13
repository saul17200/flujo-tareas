import {
  useEffect,
  useState,
  type FormEvent,
} from "react"
import { toast } from "sonner"

import { DueDatePicker } from "@/components/tasks/due-date-picker"
import { TaskComments } from "@/components/tasks/task-comments"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTaskStore } from "@/store/task-store"
import type { Task, TaskPriority } from "@/types/task"

interface TaskEditDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

function parseDateKey(dateKey: string | null) {
  return dateKey
    ? new Date(`${dateKey}T12:00:00`)
    : undefined
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function TaskEditDialog({
  task,
  open,
  onOpenChange,
}: TaskEditDialogProps) {
  const updateTask = useTaskStore(
    (state) => state.updateTask,
  )

  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(
    task.description,
  )
  const [priority, setPriority] =
    useState<TaskPriority>(task.priority)
  const [dueDate, setDueDate] = useState<Date | undefined>(
    parseDateKey(task.dueDate),
  )

  useEffect(() => {
    if (!open) {
      return
    }

    setTitle(task.title)
    setDescription(task.description)
    setPriority(task.priority)
    setDueDate(parseDateKey(task.dueDate))
  }, [open, task])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanTitle = title.trim()

    if (!cleanTitle) {
      toast.error("El nombre de la tarea es obligatorio")
      return
    }

    void updateTask(task.id, {
      title: cleanTitle,
      description: description.trim(),
      priority,
      dueDate: dueDate ? toDateKey(dueDate) : null,
    })

    toast.success("Tarea actualizada", {
      description: cleanTitle,
    })

    onOpenChange(false)
  }

  const priorityLabel =
    priority === "low"
      ? "Baja"
      : priority === "medium"
        ? "Media"
        : "Alta"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar tarea</DialogTitle>

            <DialogDescription>
              Modifica la información de la tarea.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-5">
            <div className="grid gap-2">
              <label
                htmlFor={`title-${task.id}`}
                className="text-sm font-medium"
              >
                Nombre
              </label>

              <Input
                id={`title-${task.id}`}
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor={`description-${task.id}`}
                className="text-sm font-medium"
              >
                Descripción
              </label>

              <Textarea
                id={`description-${task.id}`}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-medium">
                Prioridad
              </span>

              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority(value as TaskPriority)
                }
              >
                <SelectTrigger>
                  <span>{priorityLabel}</span>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-medium">
                Fecha límite
              </span>

              <DueDatePicker
                value={dueDate}
                onChange={setDueDate}
              />
            </div>
          </div>


          <div className="pb-5">
            <TaskComments task={task} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>

            <Button type="submit">
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
