import { CalendarDays } from "lucide-react"

import { TaskCalendar } from "@/components/dashboard/task-calendar"

export function CalendarPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
          <CalendarDays className="size-4" />
          Planificación
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Calendario
        </h1>

        <p className="mt-2 text-muted-foreground">
          Consulta tus tareas y fechas límite por día.
        </p>
      </section>

      <TaskCalendar />
    </div>
  )
}
