import {
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
import {
  DashboardActivityCard,
} from "@/features/dashboard/components/cards/dashboard-activity-card"
import {
  DashboardTasksCard,
} from "@/features/dashboard/components/cards/dashboard-tasks-card"
import { useAcademicDashboard } from "@/features/dashboard/hooks/use-academic-dashboard"


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

          <DashboardTasksCard
            task={nextTask}
          />

          <DashboardActivityCard />
        </>
      )}
    </section>
  )
}

