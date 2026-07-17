import { CheckSquare2 } from "lucide-react"
import { Link } from "react-router"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTaskStore } from "@/store/task-store"
import type { AcademicCourse } from "@/features/academic"

interface SubjectTasksProps {
  course: AcademicCourse
}

export function SubjectTasks({
  course,
}: SubjectTasksProps) {
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

  const pendingTasks = relatedTasks.filter(
    (task) => task.status === "pending",
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare2 className="size-5" />
          Tareas
        </CardTitle>

        <CardDescription>
          Actividades relacionadas con esta materia.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {relatedTasks.length === 0 ? (
          <EmptySection
            text="No hay tareas relacionadas."
          />
        ) : (
          <div className="grid gap-3">
            {relatedTasks.slice(0, 5).map((task) => (
              <article
                key={task.id}
                className="rounded-xl border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={
                        task.status === "completed"
                          ? "font-medium line-through opacity-60"
                          : "font-medium"
                      }
                    >
                      {task.title}
                    </p>

                    {task.dueDate && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Entrega: {task.dueDate}
                      </p>
                    )}
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {task.status === "completed"
                      ? "Completada"
                      : "Pendiente"}
                  </span>
                </div>
              </article>
            ))}

            <p className="text-sm text-muted-foreground">
              {pendingTasks.length} pendientes de{" "}
              {relatedTasks.length} tareas
            </p>
          </div>
        )}

        <Link
          to="/tareas"
          className="mt-4 inline-flex h-8 w-fit items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
        >
          Ver todas las tareas
        </Link>
      </CardContent>
    </Card>
  )
}

function EmptySection({
  text,
}: {
  text: string
}) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}
