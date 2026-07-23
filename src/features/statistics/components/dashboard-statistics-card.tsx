import {
  CheckCircle2,
  FileUp,
  Flame,
  GraduationCap,
  LoaderCircle,
  NotebookPen,
  Zap,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  useEventStatistics,
} from "@/features/statistics/hooks/use-event-statistics"

export function DashboardStatisticsCard() {
  const {
    statistics,
    loading,
    error,
  } = useEventStatistics()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5" />
          Estadísticas
        </CardTitle>

        <CardDescription>
          Resumen de tu actividad registrada en
          Drif Notion.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex min-h-44 items-center justify-center">
            <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-dashed p-7 text-center">
            <p className="font-medium">
              No fue posible cargar las estadísticas
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Revisa el acceso a la colección de
              eventos.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <StatisticMetric
              icon={CheckCircle2}
              value={statistics.completedTasks}
              label="Tareas completadas"
            />

            <StatisticMetric
              icon={NotebookPen}
              value={statistics.createdNotes}
              label="Notas creadas"
            />

            <StatisticMetric
              icon={FileUp}
              value={statistics.uploadedFiles}
              label="Archivos subidos"
            />

            <StatisticMetric
              icon={GraduationCap}
              value={statistics.passedCourses}
              label="Materias acreditadas"
            />

            <StatisticMetric
              icon={Zap}
              value={
                statistics.activityLastSevenDays
              }
              label="Actividad en 7 días"
            />

            <StatisticMetric
              icon={Flame}
              value={statistics.currentStreak}
              label={
                statistics.currentStreak === 1
                  ? "Día de racha"
                  : "Días de racha"
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface StatisticMetricProps {
  icon: typeof Zap
  value: number
  label: string
}

function StatisticMetric({
  icon: Icon,
  value,
  label,
}: StatisticMetricProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-background p-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <div className="min-w-0">
        <p className="text-2xl font-bold">
          {value}
        </p>

        <p className="text-sm text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  )
}
