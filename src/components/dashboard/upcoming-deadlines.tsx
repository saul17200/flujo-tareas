import { CalendarClock, TriangleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  daysUntilDate,
  formatDateKey,
  getTodayKey,
} from "@/lib/task-dates"
import { useTaskStore } from "@/store/task-store"

function getDeadlineText(days: number) {
  if (days < 0) {
    const overdueDays = Math.abs(days)

    return overdueDays === 1
      ? "Venció ayer"
      : `Venció hace ${overdueDays} días`
  }

  if (days === 0) {
    return "Vence hoy"
  }

  if (days === 1) {
    return "Vence mañana"
  }

  return `Vence en ${days} días`
}

export function UpcomingDeadlines() {
  const tasks = useTaskStore((state) => state.tasks)

  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.status === "pending" &&
        Boolean(task.dueDate),
    )
    .sort((a, b) =>
      (a.dueDate ?? "").localeCompare(b.dueDate ?? ""),
    )
    .slice(0, 5)

  const overdueCount = upcomingTasks.filter(
    (task) =>
      task.dueDate && task.dueDate < getTodayKey(),
  ).length

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Próximos vencimientos</CardTitle>

          <CardDescription>
            Las tareas que necesitan tu atención.
          </CardDescription>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CalendarClock className="size-5" />
        </div>
      </CardHeader>

      <CardContent>
        {upcomingTasks.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed text-center">
            <CalendarClock className="mb-3 size-8 text-muted-foreground" />

            <p className="font-medium">
              No hay fechas próximas
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Agrega fechas límite a tus tareas.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {overdueCount > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <TriangleAlert className="size-4" />

                {overdueCount === 1
                  ? "Tienes una tarea vencida."
                  : `Tienes ${overdueCount} tareas vencidas.`}
              </div>
            )}

            {upcomingTasks.map((task) => {
              const days = daysUntilDate(task.dueDate!)
              const overdue = days < 0

              return (
                <div
                  key={task.id}
                  className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {task.title}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDateKey(task.dueDate!)}
                    </p>
                  </div>

                  <Badge
                    variant={
                      overdue
                        ? "destructive"
                        : "secondary"
                    }
                    className="w-fit"
                  >
                    {getDeadlineText(days)}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
