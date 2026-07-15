import {
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  BookOpen,
  CheckCircle2,
  CircleAlert,
  CircleDashed,
  Clock3,
  GraduationCap,
  Save,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { useAuth } from "@/features/auth/auth-provider"
import {
  observeAcademicCourses,
  updateAcademicCourse,
} from "@/services/academic-courses"
import type {
  AcademicCourse,
  AcademicCourseStatus,
  AcademicPlan,
} from "@/types/academic-plan"

interface AcademicPlanProgressProps {
  plan: AcademicPlan
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

const statusClasses: Record<
  AcademicCourseStatus,
  string
> = {
  pending:
    "border-muted-foreground/30 bg-muted text-muted-foreground",
  "in-progress":
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  passed:
    "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
  failed:
    "border-destructive/30 bg-destructive/10 text-destructive",
  validated:
    "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
}

function isAccredited(
  status: AcademicCourseStatus,
) {
  return (
    status === "passed" ||
    status === "validated"
  )
}

export function AcademicPlanProgress({
  plan,
}: AcademicPlanProgressProps) {
  const { user } = useAuth()

  const [courses, setCourses] = useState<
    AcademicCourse[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setCourses([])
      setLoading(false)
      return
    }

    setLoading(true)

    return observeAcademicCourses(
      user.uid,
      plan.id,
      (nextCourses) => {
        setCourses(nextCourses)
        setLoading(false)
      },
      (error) => {
        console.error(error)
        setLoading(false)

        toast.error(
          "No fue posible cargar las materias.",
        )
      },
    )
  }, [plan.id, user])

  const statistics = useMemo(() => {
    const accreditedCourses = courses.filter(
      (course) =>
        isAccredited(course.status),
    )

    const failedCourses = courses.filter(
      (course) => course.status === "failed",
    )

    const inProgressCourses = courses.filter(
      (course) =>
        course.status === "in-progress",
    )

    const gradedCourses =
      accreditedCourses.filter(
        (course) => course.grade !== null,
      )

    const average =
      gradedCourses.length > 0
        ? gradedCourses.reduce(
            (total, course) =>
              total + (course.grade ?? 0),
            0,
          ) / gradedCourses.length
        : null

    const earnedCredits =
      accreditedCourses.reduce(
        (total, course) =>
          total + course.credits,
        0,
      )

    const totalCredits =
      plan.totalCredits > 0
        ? plan.totalCredits
        : courses.reduce(
            (total, course) =>
              total + course.credits,
            0,
          )

    const progress =
      totalCredits > 0
        ? Math.min(
            100,
            Math.round(
              (earnedCredits / totalCredits) *
                100,
            ),
          )
        : courses.length > 0
          ? Math.round(
              (accreditedCourses.length /
                courses.length) *
                100,
            )
          : 0

    return {
      accredited: accreditedCourses.length,
      failed: failedCourses.length,
      inProgress: inProgressCourses.length,
      pending:
        courses.length -
        accreditedCourses.length -
        failedCourses.length -
        inProgressCourses.length,
      average,
      earnedCredits,
      totalCredits,
      progress,
    }
  }, [courses, plan.totalCredits])

  const coursesBySemester = useMemo(() => {
    const grouped = new Map<
      number,
      AcademicCourse[]
    >()

    courses.forEach((course) => {
      const semesterCourses =
        grouped.get(course.semester) ?? []

      semesterCourses.push(course)
      grouped.set(
        course.semester,
        semesterCourses,
      )
    })

    return Array.from(grouped.entries()).sort(
      ([firstSemester], [secondSemester]) =>
        firstSemester - secondSemester,
    )
  }, [courses])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex min-h-64 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Cargando materias del plan...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Progreso académico
          </CardTitle>

          <CardDescription>
            Resumen calculado con las materias del
            plan activo.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={GraduationCap}
              value={`${statistics.progress}%`}
              label="Avance de carrera"
            />

            <SummaryCard
              icon={CheckCircle2}
              value={`${statistics.accredited}/${courses.length}`}
              label="Materias acreditadas"
            />

            <SummaryCard
              icon={BookOpen}
              value={`${statistics.earnedCredits}/${statistics.totalCredits}`}
              label="Créditos obtenidos"
            />

            <SummaryCard
              icon={Clock3}
              value={
                statistics.average === null
                  ? "—"
                  : statistics.average.toFixed(1)
              }
              label="Promedio general"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Avance
              </span>

              <span className="text-muted-foreground">
                {statistics.progress}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${statistics.progress}%`,
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              <CircleDashed className="size-3" />
              {statistics.pending} pendientes
            </Badge>

            <Badge variant="secondary">
              <Clock3 className="size-3" />
              {statistics.inProgress} cursando
            </Badge>

            <Badge variant="destructive">
              <CircleAlert className="size-3" />
              {statistics.failed} reprobadas
            </Badge>
          </div>
        </CardContent>
      </Card>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
            <BookOpen className="mb-3 size-10 text-muted-foreground" />

            <p className="font-medium">
              No hay materias guardadas
            </p>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Importa nuevamente la retícula o
              verifica la subcolección de materias
              en Firestore.
            </p>
          </CardContent>
        </Card>
      ) : (
        coursesBySemester.map(
          ([semester, semesterCourses]) => (
            <Card key={semester}>
              <CardHeader>
                <CardTitle>
                  Semestre {semester}
                </CardTitle>

                <CardDescription>
                  {semesterCourses.length}
                  {semesterCourses.length === 1
                    ? " materia"
                    : " materias"}
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-3">
                {semesterCourses.map(
                  (course) => (
                    <AcademicCourseRow
                      key={course.id}
                      planId={plan.id}
                      course={course}
                    />
                  ),
                )}
              </CardContent>
            </Card>
          ),
        )
      )}
    </div>
  )
}

interface AcademicCourseRowProps {
  planId: string
  course: AcademicCourse
}

function AcademicCourseRow({
  planId,
  course,
}: AcademicCourseRowProps) {
  const { user } = useAuth()

  const [status, setStatus] =
    useState<AcademicCourseStatus>(
      course.status,
    )

  const [grade, setGrade] = useState(
    course.grade === null
      ? ""
      : String(course.grade),
  )

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setStatus(course.status)
    setGrade(
      course.grade === null
        ? ""
        : String(course.grade),
    )
  }, [course.grade, course.status])

  async function handleSave() {
    if (!user) {
      return
    }

    const numericGrade =
      grade.trim() === ""
        ? null
        : Number(grade)

    if (
      numericGrade !== null &&
      (!Number.isFinite(numericGrade) ||
        numericGrade < 0 ||
        numericGrade > 100)
    ) {
      toast.error(
        "La calificación debe estar entre 0 y 100.",
      )
      return
    }

    try {
      setSaving(true)

      await updateAcademicCourse(
        user.uid,
        planId,
        course.id,
        {
          status,
          grade: numericGrade,
        },
      )

      toast.success("Materia actualizada.", {
        description: course.name,
      })
    } catch (error) {
      console.error(error)

      toast.error(
        "No fue posible actualizar la materia.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <article
      className={[
        "grid gap-4 rounded-xl border p-4",
        "lg:grid-cols-[minmax(0,1fr)_180px_130px_auto]",
        statusClasses[status],
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="break-words font-semibold">
            {course.name}
          </h3>

          {course.code && (
            <Badge variant="outline">
              {course.code}
            </Badge>
          )}
        </div>

        <p className="mt-2 text-sm opacity-80">
          {course.credits} créditos
        </p>
      </div>

      <Select
        value={status}
        onValueChange={(value) =>
          setStatus(
            (value ??
              "pending") as AcademicCourseStatus,
          )
        }
      >
        <SelectTrigger>
          <span>{statusLabels[status]}</span>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="pending">
            Pendiente
          </SelectItem>

          <SelectItem value="in-progress">
            Cursando
          </SelectItem>

          <SelectItem value="passed">
            Acreditada
          </SelectItem>

          <SelectItem value="failed">
            Reprobada
          </SelectItem>

          <SelectItem value="validated">
            Convalidada
          </SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="number"
        min={0}
        max={100}
        step="0.1"
        value={grade}
        onChange={(event) =>
          setGrade(event.target.value)
        }
        placeholder="Calificación"
        aria-label={`Calificación de ${course.name}`}
      />

      <Button
        type="button"
        onClick={() => void handleSave()}
        disabled={saving}
      >
        <Save className="size-4" />

        {saving
          ? "Guardando..."
          : "Guardar"}
      </Button>
    </article>
  )
}

interface SummaryCardProps {
  icon: typeof GraduationCap
  value: string
  label: string
}

function SummaryCard({
  icon: Icon,
  value,
  label,
}: SummaryCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-background p-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <div>
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
