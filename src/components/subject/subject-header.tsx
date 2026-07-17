import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
} from "lucide-react"
import { useNavigate } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type {
  AcademicCourse,
  AcademicCourseStatus,
  AcademicPlan,
} from "@/features/academic"

interface SubjectHeaderProps {
  plan: AcademicPlan | null
  course: AcademicCourse
}

const statusLabels: Record<
  AcademicCourseStatus,
  string
> = {
  pending: "Pendiente",
  "in-progress": "Cursando",
  passed: "Acreditada",
  failed: "Reprobada",
  validated: "Convalidada",
}

const statusVariants: Record<
  AcademicCourseStatus,
  "secondary" | "default" | "destructive" | "outline"
> = {
  pending: "secondary",
  "in-progress": "default",
  passed: "default",
  failed: "destructive",
  validated: "outline",
}

export function SubjectHeader({
  plan,
  course,
}: SubjectHeaderProps) {
  const navigate = useNavigate()

  return (
    <section className="grid gap-6">
      <Button
        type="button"
        variant="ghost"
        className="w-fit"
        onClick={() => navigate("/carrera")}
      >
        <ArrowLeft className="size-4" />
        Volver a Mi carrera
      </Button>

      <div className="flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <BookOpen className="size-7" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="break-words text-3xl font-bold tracking-tight">
                {course.name}
              </h1>

              <Badge
                variant={statusVariants[course.status]}
              >
                {statusLabels[course.status]}
              </Badge>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
              {course.code && (
                <Badge variant="outline">
                  {course.code}
                </Badge>
              )}

              <span>Semestre {course.semester}</span>
              <span>•</span>
              <span>{course.credits} créditos</span>
            </div>

            {plan && (
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="size-4" />
                {plan.career}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-muted/30 px-5 py-4 text-center">
          <p className="text-3xl font-bold">
            {course.grade ?? "—"}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Calificación
          </p>
        </div>
      </div>
    </section>
  )
}
