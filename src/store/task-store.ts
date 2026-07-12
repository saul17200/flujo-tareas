import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { Task, TaskPriority } from "@/types/task"

interface CreateTaskInput {
  title: string
  description: string
  priority: TaskPriority
}

interface TaskState {
  tasks: Task[]
  addTask: (input: CreateTaskInput) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [
        {
          id: crypto.randomUUID(),
          title: "Terminar la primera versión",
          description: "Construir el tablero inicial de FlujoTareas.",
          priority: "high",
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ],

      addTask: (input) =>
        set((state) => ({
          tasks: [
            {
              id: crypto.randomUUID(),
              title: input.title,
              description: input.description,
              priority: input.priority,
              status: "pending",
              createdAt: new Date().toISOString(),
            },
            ...state.tasks,
          ],
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status:
                    task.status === "pending" ? "completed" : "pending",
                }
              : task,
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: "flujo-tareas-storage-v2",
    },
  ),
)
