import { useState, type FormEvent } from "react"
import { toast } from "sonner"

import { DueDatePicker } from "@/components/tasks/due-date-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { useTaskStore } from "@/store/task-store"
import type { TaskPriority } from "@/types/task"

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function TaskForm() {
  const addTask = useTaskStore((state) => state.addTask)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] =
    useState<TaskPriority>("medium")
  const [dueDate, setDueDate] =
    useState<Date | undefined>()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanTitle = title.trim()

    if (!cleanTitle) {
      toast.error("Escribe el nombre de la tarea")
      return
    }

    addTask({
      title: cleanTitle,
      description: description.trim(),
      priority,
      dueDate: dueDate ? toDateKey(dueDate) : null,
    })

    toast.success("Tarea creada correctamente", {
      description: cleanTitle,
    })

    setTitle("")
    setDescription("")
    setPriority("medium")
    setDueDate(undefined)
  }

  const priorityLabel =
    priority === "low"
      ? "Baja"
      : priority === "medium"
        ? "Media"
        : "Alta"

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-2 xl:grid-cols-[1fr_1fr_150px_210px_auto]"
    >
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Nombre de la tarea"
        aria-label="Nombre de la tarea"
      />

      <Input
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        placeholder="Descripción opcional"
        aria-label="Descripción de la tarea"
      />

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

      <DueDatePicker
        value={dueDate}
        onChange={setDueDate}
      />

      <Button type="submit" className="md:col-span-2 xl:col-span-1">
        Agregar tarea
      </Button>
    </form>
  )
}
