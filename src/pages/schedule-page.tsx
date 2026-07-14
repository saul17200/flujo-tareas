import {
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  BookOpen,
  CalendarClock,
  Clock3,
} from "lucide-react"
import { toast } from "sonner"

import { SubjectForm } from "@/components/academic/subject-form"
import { WeeklySchedule } from "@/components/academic/weekly-schedule"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { useAuth } from "@/features/auth/auth-provider"
import { observeSubjects } from "@/services/subjects"
import type { Subject } from "@/types/subject"

export function SchedulePage() {
  const { user } = useAuth()

  const [subjects, setSubjects] = useState<Subject[]>(
    [],
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setSubjects([])
      setLoading(false)
      return
    }

    setLoading(true)

    const unsubscribe = observeSubjects(
      user.uid,
      (nextSubjects) => {
        setSubjects(nextSubjects)
        setLoading(false)
      },
      (error) => {
        console.error(error)
        setLoading(false)
        toast.error(
          "No fue posible cargar el horario.",
        )
      },
    )

    return unsubscribe
  }, [user])

  const weeklyClasses = useMemo(
    () =>
      subjects.reduce(
        (total, subject) =>
          total + subject.days.length,
        0,
      ),
    [subjects],
  )

  const periods = useMemo(
    () =>
      new Set(
        subjects
          .map((subject) => subject.period)
          .filter(Boolean),
      ).size,
    [subjects],
  )

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
          <CalendarClock className="size-4" />
          Organización académica
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Horario de clases
        </h1>

        <p className="mt-2 text-muted-foreground">
          Registra tus materias y consulta tu semana
          desde cualquier dispositivo.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </div>

            <div>
              <p className="text-2xl font-bold">
                {subjects.length}
              </p>

              <p className="text-sm text-muted-foreground">
                Materias
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock3 className="size-5" />
            </div>

            <div>
              <p className="text-2xl font-bold">
                {weeklyClasses}
              </p>

              <p className="text-sm text-muted-foreground">
                Clases por semana
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarClock className="size-5" />
            </div>

            <div>
              <p className="text-2xl font-bold">
                {periods}
              </p>

              <p className="text-sm text-muted-foreground">
                Periodos registrados
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <SubjectForm />

      <WeeklySchedule
        subjects={subjects}
        loading={loading}
      />
    </div>
  )
}
