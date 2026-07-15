import { BarChart3 } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTaskStore } from "@/store/task-store"
import type { AcademicCourse } from "@/types/academic-plan"

interface SubjectStatisticsProps {
  course: AcademicCourse
}

export function SubjectStatistics({
  course,
}: SubjectStatisticsProps) {
  const tasks = useTaskStore((state) => state.tasks)

  const relatedTasks = tasks.filter(
    (task) =>
      task.subjectName
        ?.trim()
        .toLocaleLowerCase("es") ===
      course.name
        .trim()
        .toLocaleLowerCase("es"),
  )

  const completed = relatedTasks.filter(
    (task) => task.status === "completed",
  ).length

  const productivity =
    relatedTasks.length === 0
      ? 0
      : Math.round(
          (completed / relatedTasks.length) * 100,
        )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="size-5" />
          Estadísticas
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-3">
        <Stat
          value={String(relatedTasks.length)}
          label="Tareas"
        />

        <Stat
          value={String(completed)}
          label="Completadas"
        />

        <Stat
          value={`${productivity}%`}
          label="Productividad"
        />
      </CardContent>
    </Card>
  )
}

function Stat({
  value,
  label,
}: {
  value: string
  label: string
}) {
  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <p className="text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
