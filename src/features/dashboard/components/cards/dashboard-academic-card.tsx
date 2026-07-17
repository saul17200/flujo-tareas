import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  TrendingUp,
} from "lucide-react"
import { Link } from "react-router"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DashboardAcademicCardProps {
  career: string
  institution: string
  curriculum: string
  inProgress: number
  accredited: number
  average: number | null
  earnedCredits: number
  totalCredits: number
  progress: number
}

export function DashboardAcademicCard({
  career,
  institution,
  curriculum,
  inProgress,
  accredited,
  average,
  earnedCredits,
  totalCredits,
  progress,
}: DashboardAcademicCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="break-words">
              {career}
            </CardTitle>

            <CardDescription className="mt-1">
              {institution ||
                "Institución no especificada"}

              {curriculum
                ? ` · ${curriculum}`
                : ""}
            </CardDescription>
          </div>

          <Link
            to="/carrera"
            className="inline-flex h-8 w-fit shrink-0 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Ver carrera
          </Link>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AcademicMetric
            icon={BookOpen}
            value={String(inProgress)}
            label="Materias cursando"
          />

          <AcademicMetric
            icon={CheckCircle2}
            value={String(accredited)}
            label="Materias acreditadas"
          />

          <AcademicMetric
            icon={TrendingUp}
            value={
              average === null
                ? "—"
                : average.toFixed(1)
            }
            label="Promedio general"
          />

          <AcademicMetric
            icon={GraduationCap}
            value={`${earnedCredits}/${totalCredits}`}
            label="Créditos"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Avance de carrera
            </span>

            <span className="text-muted-foreground">
              {progress}%
            </span>
          </div>

          <div
            className="h-3 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Avance de carrera"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, progress),
                )}%`,
              }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {earnedCredits} de {totalCredits} créditos
            obtenidos
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface AcademicMetricProps {
  icon: typeof BookOpen
  value: string
  label: string
}

function AcademicMetric({
  icon: Icon,
  value,
  label,
}: AcademicMetricProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-background p-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
    </div>
  )
}
