import { create } from "zustand"

import {
  removeTask,
  saveTask,
  saveTaskOrder,
} from "@/services/tasks"
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
  userId: string | null
  loadingTasks: boolean
  search: string
  statusFilter: StatusFilter
  priorityFilter: PriorityFilter

  setUserId: (userId: string | null) => void
  setTasks: (tasks: Task[]) => void
  setLoadingTasks: (loading: boolean) => void

  addTask: (input: TaskInput) => Promise<void>
  updateTask: (id: string, input: TaskInput) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  moveTask: (
    activeId: string,
    overId: string | null,
    targetStatus: TaskStatus,
  ) => Promise<void>

  setSearch: (search: string) => void
  setStatusFilter: (filter: StatusFilter) => void
  setPriorityFilter: (filter: PriorityFilter) => void
  clearFilters: () => void
  resetTasks: () => void
}

function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  )
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  userId: null,
  loadingTasks: true,
  search: "",
  statusFilter: "all",
  priorityFilter: "all",

  setUserId: (userId) => set({ userId }),

  setTasks: (tasks) =>
    set({
      tasks,
      loadingTasks: false,
    }),

  setLoadingTasks: (loadingTasks) =>
    set({ loadingTasks }),

  addTask: async (input) => {
    const { userId, tasks } = get()

    if (!userId) {
      throw new Error("No hay una sesión activa.")
    }

    const task: Task = {
      id: createId(),
      ...input,
      status: "pending",
      createdAt: new Date().toISOString(),
      order: tasks.length,
    }

    set({
      tasks: [task, ...tasks],
    })

    await saveTask(userId, task)
  },

  updateTask: async (id, input) => {
    const { userId, tasks } = get()

    if (!userId) {
      throw new Error("No hay una sesión activa.")
    }

    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            ...input,
          }
        : task,
    )

    const updatedTask = updatedTasks.find(
      (task) => task.id === id,
    )

    if (!updatedTask) {
      return
    }

    set({ tasks: updatedTasks })
    await saveTask(userId, updatedTask)
  },

  toggleTask: async (id) => {
    const { userId, tasks } = get()

    if (!userId) {
      throw new Error("No hay una sesión activa.")
    }

    const updatedTasks: Task[] = tasks.map((task) => {
      if (task.id !== id) {
        return task
      }

      const nextStatus: TaskStatus =
        task.status === "pending"
          ? "completed"
          : "pending"

      return {
        ...task,
        status: nextStatus,
      }
    })

    const updatedTask = updatedTasks.find(
      (task) => task.id === id,
    )

    if (!updatedTask) {
      return
    }

    set({ tasks: updatedTasks })
    await saveTask(userId, updatedTask)
  },

  deleteTask: async (id) => {
    const { userId, tasks } = get()

    if (!userId) {
      throw new Error("No hay una sesión activa.")
    }

    set({
      tasks: tasks.filter((task) => task.id !== id),
    })

    await removeTask(userId, id)
  },

  moveTask: async (
    activeId,
    overId,
    targetStatus,
  ) => {
    const { userId, tasks } = get()

    if (!userId) {
      throw new Error("No hay una sesión activa.")
    }

    const activeIndex = tasks.findIndex(
      (task) => task.id === activeId,
    )

    if (activeIndex < 0) {
      return
    }

    const nextTasks = [...tasks]
    const [activeTask] = nextTasks.splice(activeIndex, 1)

    const movedTask: Task = {
      ...activeTask,
      status: targetStatus,
    }

    if (
      overId &&
      overId !== "pending" &&
      overId !== "completed"
    ) {
      const overIndex = nextTasks.findIndex(
        (task) => task.id === overId,
      )

      if (overIndex >= 0) {
        nextTasks.splice(overIndex, 0, movedTask)
      } else {
        nextTasks.push(movedTask)
      }
    } else {
      nextTasks.push(movedTask)
    }

    const orderedTasks = nextTasks.map((task, index) => ({
      ...task,
      order: index,
    }))

    set({ tasks: orderedTasks })
    await saveTaskOrder(userId, orderedTasks)
  },

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

  resetTasks: () =>
    set({
      tasks: [],
      userId: null,
      loadingTasks: true,
      search: "",
      statusFilter: "all",
      priorityFilter: "all",
    }),
}))
