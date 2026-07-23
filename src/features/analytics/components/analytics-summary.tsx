import {
  BarChart3,
  CheckCircle2,
  Clock3,
  FileUp,
  Flame,
  GraduationCap,
  LoaderCircle,
  NotebookPen,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ActivityWeekChart } from "@/features/analytics/components/activity-week-chart"
import { useAnalytics } from "@/features/analytics/hooks/use-analytics"

function formatHour(hour: number | null) {
  if (hour === null) {
    return "—"
  }

  return `${String(hour).padStart(
    2,
    "0",
  )}:00`
}

export function AnalyticsSummary() {
  const {
    analytics,
    loading,
    error,
  } = useAnalytics()

  if (loading) {
    return (
      <Card>
        <CardContent className="flex min-h-72 items-center justify-center">
          <LoaderCircle className="size-7 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="font-medium">
            No fue posible cargar las analíticas
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Revisa las reglas de Firestore para
            la colección de eventos.
          </p>
        </CardContent>
      </Card>
    )
  }

  const TrendIcon =
    analytics.weeklyChangePercentage !==
      null &&
    analytics.weeklyChangePercentage < 0
      ? TrendingDown
      : TrendingUp

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-medium text-primary">
          Centro de analíticas
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Tu actividad académica
        </h1>

        <p className="mt-2 text-muted-foreground">
          Analiza tu productividad, constancia y
          progreso dentro de Drif Notion.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsMetric
          icon={Zap}
          value={String(
            analytics.activityLastSevenDays,
          )}
          label="Acciones esta semana"
        />

        <AnalyticsMetric
          icon={Flame}
          value={String(
            analytics.currentStreak,
          )}
          label="Días de racha"
        />

        <AnalyticsMetric
          icon={BarChart3}
          value={String(
            analytics.averageDailyActivity,
          )}
          label="Promedio diario"
        />

        <AnalyticsMetric
          icon={Clock3}
          value={formatHour(
            analytics.mostActiveHour,
          )}
          label="Hora más activa"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>
                Actividad semanal
              </CardTitle>

              <CardDescription>
                Acciones realizadas durante los
                últimos siete días.
              </CardDescription>
            </div>

            {analytics.weeklyChangePercentage !==
              null && (
              <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                <TrendIcon className="size-4" />

                <span>
                  {analytics.weeklyChangePercentage >
                  0
                    ? "+"
                    : ""}
                  {
                    analytics.weeklyChangePercentage
                  }
                  % respecto a la semana anterior
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <ActivityWeekChart
            data={analytics.dailyActivity}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsMetric
          icon={CheckCircle2}
          value={String(
            analytics.completedTasks,
          )}
          label="Tareas completadas"
        />

        <AnalyticsMetric
          icon={NotebookPen}
          value={String(
            analytics.createdNotes,
          )}
          label="Notas creadas"
        />

        <AnalyticsMetric
          icon={FileUp}
          value={String(
            analytics.uploadedFiles,
          )}
          label="Archivos subidos"
        />

        <AnalyticsMetric
          icon={GraduationCap}
          value={String(
            analytics.passedCourses,
          )}
          label="Materias acreditadas"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Comportamiento
          </CardTitle>

          <CardDescription>
            Patrones detectados a partir de tu
            actividad.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Insight
            label="Día más activo"
            value={
              analytics.mostActiveDay
                ? analytics.mostActiveDay
                : "Sin actividad suficiente"
            }
          />

          <Insight
            label="Eventos registrados"
            value={String(
              analytics.totalEvents,
            )}
          />
        </CardContent>
      </Card>
    </section>
  )
}

interface AnalyticsMetricProps {
  icon: typeof Zap
  value: string
  label: string
}

function AnalyticsMetric({
  icon: Icon,
  value,
  label,
}: AnalyticsMetricProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-2xl font-bold">
            {value}
          </p>

          <p className="text-sm text-muted-foreground">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function Insight({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold capitalize">
        {value}
      </p>
    </div>
  )
}
