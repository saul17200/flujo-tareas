import {
  CheckCircle2,
  CircleDashed,
  Gauge,
  TriangleAlert,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import {
  isTaskDueToday,
  isTaskOverdue,
} from "@/lib/task-dates"
import { useTaskStore } from "@/store/task-store"

export function DashboardOverview() {
  const tasks = useTaskStore((state) => state.tasks)
  const loadingTasks = useTaskStore(
    (state) => state.loadingTasks,
  )

  const completed = tasks.filter(
    (task) => task.status === "completed",
  ).length

  const pending = tasks.filter(
    (task) => task.status === "pending",
  ).length

  const overdue = tasks.filter(isTaskOverdue).length
  const dueToday = tasks.filter(isTaskDueToday).length

  const productivity =
    tasks.length === 0
      ? 0
      : Math.round((completed / tasks.length) * 100)

  const stats = [
    {
      title: "Pendientes",
      value: pending,
      description:
        dueToday === 1
          ? "1 vence hoy"
          : `${dueToday} vencen hoy`,
      icon: CircleDashed,
      iconClassName:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Completadas",
      value: completed,
      description: `${tasks.length} tareas en total`,
      icon: CheckCircle2,
      iconClassName:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Vencidas",
      value: overdue,
      description:
        overdue === 0
          ? "Todo bajo control"
          : "Requieren atención",
      icon: TriangleAlert,
      iconClassName:
        "bg-destructive/10 text-destructive",
    },
    {
      title: "Productividad",
      value: `${productivity}%`,
      description: "Tareas completadas",
      icon: Gauge,
      iconClassName:
        "bg-primary/10 text-primary",
    },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <Card
            key={stat.title}
            className="overflow-hidden transition-shadow hover:shadow-md"
          >
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight">
                  {loadingTasks ? "—" : stat.value}
                </p>

                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>

              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${stat.iconClassName}`}
              >
                <Icon className="size-6" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
