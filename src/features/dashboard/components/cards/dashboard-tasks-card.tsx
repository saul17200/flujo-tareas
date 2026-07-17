import { CalendarClock, CheckCircle2 } from "lucide-react"
import { Link } from "react-router"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DashboardTask {
  title: string
  dueDate: string | null
  subjectName: string | null
}

interface DashboardTasksCardProps {
  task: DashboardTask | null
}

function formatDate(value: string | null) {
  if (!value) return "Sin fecha"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Fecha desconocida"
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function DashboardTasksCard({
  task,
}: DashboardTasksCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="size-5" />
          Próxima tarea
        </CardTitle>

        <CardDescription>
          La entrega más cercana.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {task ? (
          <div className="flex flex-col gap-4 rounded-xl border p-4">
            <div>
              <h3 className="font-semibold">
                {task.title}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {formatDate(task.dueDate)}
              </p>

              {task.subjectName && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {task.subjectName}
                </p>
              )}
            </div>

            <Link
              to="/tareas"
              className="inline-flex h-9 items-center justify-center rounded-lg border px-4 text-sm font-medium hover:bg-muted"
            >
              Ver tareas
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <CheckCircle2 className="mx-auto size-8 text-muted-foreground" />

            <p className="mt-3 font-medium">
              No hay tareas próximas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
