import {
  CheckCircle2,
  CircleDashed,
  ListTodo,
  TriangleAlert,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { useTaskStore } from "@/store/task-store"

export function TaskStats() {
  const tasks = useTaskStore((state) => state.tasks)

  const pending = tasks.filter(
    (task) => task.status === "pending",
  ).length

  const completed = tasks.filter(
    (task) => task.status === "completed",
  ).length

  const highPriority = tasks.filter(
    (task) =>
      task.priority === "high" &&
      task.status === "pending",
  ).length

  const stats = [
    {
      title: "Total",
      value: tasks.length,
      icon: ListTodo,
    },
    {
      title: "Pendientes",
      value: pending,
      icon: CircleDashed,
    },
    {
      title: "Completadas",
      value: completed,
      icon: CheckCircle2,
    },
    {
      title: "Prioridad alta",
      value: highPriority,
      icon: TriangleAlert,
    },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <Card key={stat.title}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {stat.value}
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                <Icon className="size-5" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
