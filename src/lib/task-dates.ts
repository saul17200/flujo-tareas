import type { Task } from "@/types/task"

export function getTodayKey() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function parseDateKey(dateKey: string) {
  return new Date(`${dateKey}T12:00:00`)
}

export function formatDateKey(dateKey: string) {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(parseDateKey(dateKey))
}

export function isTaskOverdue(task: Task) {
  return Boolean(
    task.dueDate &&
      task.status === "pending" &&
      task.dueDate < getTodayKey(),
  )
}

export function isTaskDueToday(task: Task) {
  return Boolean(
    task.dueDate &&
      task.status === "pending" &&
      task.dueDate === getTodayKey(),
  )
}

export function daysUntilDate(dateKey: string) {
  const today = parseDateKey(getTodayKey())
  const target = parseDateKey(dateKey)

  return Math.round(
    (target.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24),
  )
}
