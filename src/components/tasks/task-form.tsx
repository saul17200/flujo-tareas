import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTaskStore } from "@/store/task-store"
import type { TaskPriority } from "@/types/task"

export function TaskForm() {
  const addTask = useTaskStore((state) => state.addTask)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("medium")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanTitle = title.trim()

    if (!cleanTitle) {
      return
    }

    addTask({
      title: cleanTitle,
      description: description.trim(),
      priority,
    })

    setTitle("")
    setDescription("")
    setPriority("medium")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-[1fr_1fr_180px_auto]"
    >
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Nombre de la tarea"
        aria-label="Nombre de la tarea"
      />

      <Input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Descripción opcional"
        aria-label="Descripción de la tarea"
      />

      <Select
        value={priority}
        onValueChange={(value) => setPriority(value as TaskPriority)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Prioridad" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="low">Baja</SelectItem>
          <SelectItem value="medium">Media</SelectItem>
          <SelectItem value="high">Alta</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit">Agregar tarea</Button>
    </form>
  )
}
