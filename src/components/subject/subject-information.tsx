import {
  Award,
  BookOpen,
  CalendarRange,
  Hash,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AcademicCourse } from "@/features/academic"

interface SubjectInformationProps {
  course: AcademicCourse
}

export function SubjectInformation({
  course,
}: SubjectInformationProps) {
  const information = [
    {
      label: "Clave",
      value: course.code || "Sin clave",
      icon: Hash,
    },
    {
      label: "Semestre",
      value: String(course.semester),
      icon: CalendarRange,
    },
    {
      label: "Créditos",
      value: String(course.credits),
      icon: BookOpen,
    },
    {
      label: "Calificación",
      value:
        course.grade === null
          ? "Sin registrar"
          : String(course.grade),
      icon: Award,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información académica</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {information.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-xl border bg-muted/20 p-4"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  {item.label}
                </p>

                <p className="truncate font-semibold">
                  {item.value}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
