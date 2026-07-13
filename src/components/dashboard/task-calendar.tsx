import { useMemo, useState } from "react"
import { es } from "date-fns/locale"
import {
  CalendarDays,
  CheckCircle2,
  CircleDashed,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTaskStore } from "@/store/task-store"
import type {
  Task,
  TaskPriority,
} from "@/types/task"

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

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function parseDateKey(dateKey: string) {
  return new Date(`${dateKey}T12:00:00`)
}

function formatSelectedDate(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

function TaskCalendarItem({ task }: { task: Task }) {
  const completed = task.status === "completed"

  return (
    <article className="rounded-xl border bg-card p-4">
      <div className="flex items-start gap-3">
        <div
          className={
            completed
              ? "mt-0.5 text-emerald-600 dark:text-emerald-400"
              : "mt-0.5 text-amber-600 dark:text-amber-400"
          }
        >
          {completed ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <CircleDashed className="size-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={
              completed
                ? "break-words font-medium line-through opacity-60"
                : "break-words font-medium"
            }
          >
            {task.title}
          </p>

          {task.description && (
            <p className="mt-1 break-words text-sm text-muted-foreground">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge
              variant={priorityVariants[task.priority]}
            >
              Prioridad {priorityLabels[task.priority]}
            </Badge>

            <Badge variant="outline">
              {completed ? "Completada" : "Pendiente"}
            </Badge>
          </div>
        </div>
      </div>
    </article>
  )
}

export function TaskCalendar() {
  const tasks = useTaskStore((state) => state.tasks)

  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(),
  )

  const taskDates = useMemo(
    () =>
      tasks
        .filter(
          (task): task is Task & { dueDate: string } =>
            Boolean(task.dueDate),
        )
        .map((task) => parseDateKey(task.dueDate)),
    [tasks],
  )

  const selectedDateKey = toDateKey(selectedDate)

  const selectedTasks = useMemo(
    () =>
      tasks
        .filter(
          (task) => task.dueDate === selectedDateKey,
        )
        .sort((a, b) => {
          if (a.status !== b.status) {
            return a.status === "pending" ? -1 : 1
          }

          return a.createdAt.localeCompare(b.createdAt)
        }),
    [tasks, selectedDateKey],
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Calendario de tareas</CardTitle>

            <CardDescription>
              Selecciona un día para consultar sus actividades.
            </CardDescription>
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="size-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="overflow-x-auto rounded-xl border p-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date)
              }
            }}
            locale={es}
            modifiers={{
              hasTasks: taskDates,
            }}
            modifiersClassNames={{
              hasTasks:
                "relative font-bold after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary",
            }}
          />
        </div>

        <section className="min-w-0">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold capitalize">
                {formatSelectedDate(selectedDate)}
              </h3>

              <p className="text-sm text-muted-foreground">
                {selectedTasks.length === 1
                  ? "1 tarea programada"
                  : `${selectedTasks.length} tareas programadas`}
              </p>
            </div>

            <Badge variant="secondary" className="w-fit">
              {selectedTasks.filter(
                (task) => task.status === "completed",
              ).length}
              /{selectedTasks.length} completadas
            </Badge>
          </div>

          <ScrollArea className="h-[360px] pr-3">
            {selectedTasks.length === 0 ? (
              <div className="flex h-80 flex-col items-center justify-center rounded-xl border border-dashed text-center">
                <CalendarDays className="mb-3 size-9 text-muted-foreground" />

                <p className="font-medium">
                  No hay tareas para este día
                </p>

                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  Selecciona otro día o crea una tarea con esta
                  fecha límite.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {selectedTasks.map((task) => (
                  <TaskCalendarItem
                    key={task.id}
                    task={task}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </section>
      </CardContent>
    </Card>
  )
}
