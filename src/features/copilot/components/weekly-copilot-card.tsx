import {
  AlertTriangle,
  CalendarRange,
  CheckCircle2,
  LoaderCircle,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  useWeeklyCopilot,
} from "@/features/copilot/hooks/use-weekly-copilot"

export function WeeklyCopilotCard() {
  const {
    summary,
    loading,
    error,
  } = useWeeklyCopilot()

  if (loading) {
    return (
      <Card>
        <CardContent className="flex min-h-64 items-center justify-center">
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
            No fue posible generar el resumen semanal
          </p>
        </CardContent>
      </Card>
    )
  }

  const TrendIcon =
    summary.trend === "down"
      ? TrendingDown
      : TrendingUp

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarRange className="size-5" />
              Resumen semanal
            </CardTitle>

            <CardDescription>
              Avances, riesgos y siguiente objetivo.
            </CardDescription>
          </div>

          {summary.changePercentage !==
            null && (
            <div className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
              <TrendIcon className="size-4" />

              <span>
                {summary.changePercentage > 0
                  ? "+"
                  : ""}
                {summary.changePercentage}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <WeeklyMetric
            icon={Sparkles}
            value={String(
              summary.currentWeekActivity,
            )}
            label="Acciones"
          />

          <WeeklyMetric
            icon={CheckCircle2}
            value={String(
              summary.completedTasks,
            )}
            label="Tareas completadas"
          />

          <WeeklyMetric
            icon={Star}
            value={`${summary.earnedXp} XP`}
            label="XP ganado"
          />

          <WeeklyMetric
            icon={Trophy}
            value={String(
              summary.completedGoalDays,
            )}
            label="Días con meta"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Insight
            icon={Sparkles}
            title="Principal avance"
            description={
              summary.highlight
            }
          />

          <Insight
            icon={
              summary.risk
                ? AlertTriangle
                : CheckCircle2
            }
            title={
              summary.risk
                ? "Riesgo detectado"
                : "Buen estado"
            }
            description={
              summary.risk ??
              "No se detectaron riesgos importantes esta semana."
            }
          />
        </div>

        <div className="rounded-2xl border bg-primary/5 p-5">
          <p className="text-sm font-medium text-primary">
            Recomendación del Copiloto
          </p>

          <p className="mt-2 font-semibold">
            {summary.recommendation}
          </p>

          {summary.mostActiveDay && (
            <p className="mt-2 text-sm capitalize text-muted-foreground">
              Tu día más activo fue{" "}
              {summary.mostActiveDay}.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function WeeklyMetric({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Sparkles
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xl font-bold">
          {value}
        </p>

        <p className="text-xs text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  )
}

function Insight({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Sparkles
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3 rounded-2xl border p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <div>
        <p className="font-semibold">
          {title}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
