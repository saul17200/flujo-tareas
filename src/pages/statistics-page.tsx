import { BarChart3 } from "lucide-react"

import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { TaskCharts } from "@/components/dashboard/task-charts"

export function StatisticsPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
          <BarChart3 className="size-4" />
          Rendimiento
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Estadísticas
        </h1>

        <p className="mt-2 text-muted-foreground">
          Analiza el estado de tus tareas y tu nivel
          de productividad.
        </p>
      </section>

      <DashboardOverview />
      <TaskCharts />
    </div>
  )
}
