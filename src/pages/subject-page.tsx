import {
  useEffect,
  useState,
} from "react"
import {
  BookOpen,
  FileText,
  FolderOpen,
  Info,
  LayoutDashboard,
} from "lucide-react"
import {
  Navigate,
  useParams,
} from "react-router"
import { toast } from "sonner"

import { SubjectExams } from "@/components/subject/subject-exams"
import { SubjectFiles } from "@/components/subject/subject-files"
import { SubjectHeader } from "@/components/subject/subject-header"
import { SubjectInformation } from "@/components/subject/subject-information"
import { SubjectNotes } from "@/components/subject/subject-notes"
import { SubjectStatistics } from "@/components/subject/subject-statistics"
import { SubjectTasks } from "@/components/subject/subject-tasks"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/auth-provider"
import { observeAcademicCourse } from "@/services/academic-courses"
import { observeAcademicPlans } from "@/services/academic-plans"
import type {
  AcademicCourse,
  AcademicPlan,
} from "@/types/academic-plan"

type SubjectTab =
  | "overview"
  | "tasks"
  | "notes"
  | "files"

const tabs = [
  {
    value: "overview" as const,
    label: "Resumen",
    icon: LayoutDashboard,
  },
  {
    value: "tasks" as const,
    label: "Tareas",
    icon: BookOpen,
  },
  {
    value: "notes" as const,
    label: "Notas",
    icon: FileText,
  },
  {
    value: "files" as const,
    label: "Archivos",
    icon: FolderOpen,
  },
]

export function SubjectPage() {
  const { user } = useAuth()
  const { planId, courseId } = useParams<{
    planId: string
    courseId: string
  }>()

  const [course, setCourse] =
    useState<AcademicCourse | null>(null)
  const [plan, setPlan] =
    useState<AcademicPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] =
    useState<SubjectTab>("overview")

  useEffect(() => {
    if (!user || !planId || !courseId) {
      setLoading(false)
      return
    }

    setLoading(true)

    const unsubscribeCourse =
      observeAcademicCourse(
        user.uid,
        planId,
        courseId,
        (nextCourse) => {
          setCourse(nextCourse)
          setLoading(false)
        },
        (error) => {
          console.error(error)
          setLoading(false)
          toast.error(
            "No fue posible cargar la materia.",
          )
        },
      )

    const unsubscribePlans =
      observeAcademicPlans(
        user.uid,
        (plans) => {
          setPlan(
            plans.find(
              (currentPlan) =>
                currentPlan.id === planId,
            ) ?? null,
          )
        },
        (error) => {
          console.error(error)
        },
      )

    return () => {
      unsubscribeCourse()
      unsubscribePlans()
    }
  }, [courseId, planId, user])

  if (!planId || !courseId) {
    return <Navigate to="/carrera" replace />
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Cargando materia...
        </p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Info className="mx-auto size-10 text-muted-foreground" />

        <h1 className="mt-4 text-2xl font-bold">
          Materia no encontrada
        </h1>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <SubjectHeader
        plan={plan}
        course={course}
      />

      <nav className="flex gap-2 overflow-x-auto rounded-xl border bg-card p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.value

          return (
            <Button
              key={tab.value}
              type="button"
              variant={
                active ? "default" : "ghost"
              }
              onClick={() =>
                setActiveTab(tab.value)
              }
              className="shrink-0"
            >
              <Icon className="size-4" />
              {tab.label}
            </Button>
          )
        })}
      </nav>

      {activeTab === "overview" && (
        <div className="grid gap-6">
          <SubjectInformation course={course} />

          <div className="grid gap-6 xl:grid-cols-2">
            <SubjectTasks course={course} />
            <SubjectStatistics course={course} />
          </div>

          <SubjectExams />
        </div>
      )}

      {activeTab === "tasks" && (
        <SubjectTasks course={course} />
      )}

      {activeTab === "notes" && (
        <SubjectNotes />
      )}

      {activeTab === "files" && (
        <SubjectFiles />
      )}
    </div>
  )
}
