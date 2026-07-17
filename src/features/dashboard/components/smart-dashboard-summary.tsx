import {
  CalendarClock,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react"
import { Link } from "react-router"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/features/auth/auth-provider"
import {
  DashboardAcademicCard,
} from "@/features/dashboard/components/cards/dashboard-academic-card"
import { useAcademicDashboard } from "@/features/dashboard/hooks/use-academic-dashboard"

function formatTaskDate(value: string | null) {
  if (!value) {
    return "Sin fecha"
  }

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

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) {
    return "Buenos días"
  }

  if (hour < 19) {
    return "Buenas tardes"
  }

  return "Buenas noches"
}

export function SmartDashboardSummary() {
  const { user } = useAuth()

  const {
    activePlan,
    statistics,
    nextTask,
    loading,
  } = useAcademicDashboard()

  const displayName =
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    "estudiante"

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-medium text-primary">
          Centro académico
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {getGreeting()}, {displayName} 👋
        </h1>

        <p className="mt-2 text-muted-foreground">
          Este es el resumen de tu progreso y tus
          próximas actividades.
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex min-h-44 items-center justify-center">
            <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : !activePlan ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Configura tu carrera
            </CardTitle>

            <CardDescription>
              Importa una retícula para mostrar aquí
              tu avance, créditos y promedio.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Link
              to="/carrera"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Ir a Mi carrera
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <DashboardAcademicCard
            career={activePlan.career}
            institution={activePlan.institution}
            curriculum={activePlan.curriculum}
            inProgress={statistics.inProgress}
            accredited={statistics.accredited}
            average={statistics.average}
            earnedCredits={statistics.earnedCredits}
            totalCredits={statistics.totalCredits}
            progress={statistics.progress}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="size-5" />
                Próxima tarea
              </CardTitle>

              <CardDescription>
                La entrega más cercana registrada.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {nextTask ? (
                <div className="flex flex-col gap-4 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {nextTask.title}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Entrega:{" "}
                      {formatTaskDate(
                        nextTask.dueDate,
                      )}
                    </p>

                    {nextTask.subjectName && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Materia:{" "}
                        {nextTask.subjectName}
                      </p>
                    )}
                  </div>

                  <Link
                    to="/tareas"
                    className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Ver tareas
                  </Link>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-8 text-center">
                  <CheckCircle2 className="mx-auto size-9 text-muted-foreground" />

                  <p className="mt-3 font-medium">
                    No hay entregas próximas
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Las tareas con fecha aparecerán
                    automáticamente aquí.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </section>
  )
}

