import { create } from "zustand"
import { persist } from "zustand/middleware"

import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types/task"

export type StatusFilter = "all" | TaskStatus
export type PriorityFilter = "all" | TaskPriority

export interface TaskInput {
  title: string
  description: string
  priority: TaskPriority
  dueDate: string | null
}

interface TaskState {
  tasks: Task[]
  search: string
  statusFilter: StatusFilter
  priorityFilter: PriorityFilter

  addTask: (input: TaskInput) => void
  updateTask: (id: string, input: TaskInput) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  moveTask: (
    activeId: string,
    overId: string | null,
    targetStatus: TaskStatus,
  ) => void

  setSearch: (search: string) => void
  setStatusFilter: (filter: StatusFilter) => void
  setPriorityFilter: (filter: PriorityFilter) => void
  clearFilters: () => void
}

function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  )
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [
        {
          id: createId(),
          title: "Terminar la primera versión",
          description: "Construir el tablero inicial de FlujoTareas.",
          priority: "high",
          status: "pending",
          createdAt: new Date().toISOString(),
          dueDate: null,
        },
      ],

      search: "",
      statusFilter: "all",
      priorityFilter: "all",

      addTask: (input) =>
        set((state) => ({
          tasks: [
            {
              id: createId(),
              title: input.title,
              description: input.description,
              priority: input.priority,
              status: "pending",
              createdAt: new Date().toISOString(),
              dueDate: input.dueDate,
            },
            ...state.tasks,
          ],
        })),

      updateTask: (id, input) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...input,
                }
              : task,
          ),
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status:
                    task.status === "pending"
                      ? "completed"
                      : "pending",
                }
              : task,
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      moveTask: (activeId, overId, targetStatus) =>
        set((state) => {
          const activeTask = state.tasks.find(
            (task) => task.id === activeId,
          )

          if (!activeTask) {
            return state
          }

          const remainingTasks = state.tasks.filter(
            (task) => task.id !== activeId,
          )

          const movedTask: Task = {
            ...activeTask,
            status: targetStatus,
          }

          if (
            overId &&
            overId !== "pending" &&
            overId !== "completed"
          ) {
            const overIndex = remainingTasks.findIndex(
              (task) => task.id === overId,
            )

            if (overIndex >= 0) {
              remainingTasks.splice(overIndex, 0, movedTask)

              return {
                tasks: remainingTasks,
              }
            }
          }

          const lastTargetIndex = remainingTasks.reduce(
            (lastIndex, task, index) =>
              task.status === targetStatus ? index : lastIndex,
            -1,
          )

          remainingTasks.splice(
            lastTargetIndex + 1,
            0,
            movedTask,
          )

          return {
            tasks: remainingTasks,
          }
        }),

      setSearch: (search) => set({ search }),

      setStatusFilter: (statusFilter) =>
        set({ statusFilter }),

      setPriorityFilter: (priorityFilter) =>
        set({ priorityFilter }),

      clearFilters: () =>
        set({
          search: "",
          statusFilter: "all",
          priorityFilter: "all",
        }),
    }),
    {
      name: "flujo-tareas-storage-v3",

      partialize: (state) => ({
        tasks: state.tasks,
      }),

      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<TaskState>

        return {
          ...currentState,
          ...persisted,
          tasks: (persisted.tasks ?? currentState.tasks).map(
            (task) => ({
              ...task,
              dueDate: task.dueDate ?? null,
            }),
          ),
        }
      },
    },
  ),
)
