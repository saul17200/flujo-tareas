import {
  CalendarClock,
  MapPin,
  Trash2,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/features/auth/auth-provider"
import { removeSubject } from "@/services/subjects"
import type {
  Subject,
  Weekday,
} from "@/types/subject"

const weekdays: {
  value: Weekday
  label: string
  shortLabel: string
}[] = [
  {
    value: "monday",
    label: "Lunes",
    shortLabel: "Lun",
  },
  {
    value: "tuesday",
    label: "Martes",
    shortLabel: "Mar",
  },
  {
    value: "wednesday",
    label: "Miércoles",
    shortLabel: "Mié",
  },
  {
    value: "thursday",
    label: "Jueves",
    shortLabel: "Jue",
  },
  {
    value: "friday",
    label: "Viernes",
    shortLabel: "Vie",
  },
  {
    value: "saturday",
    label: "Sábado",
    shortLabel: "Sáb",
  },
]

interface WeeklyScheduleProps {
  subjects: Subject[]
  loading: boolean
}

function SubjectBlock({
  subject,
}: {
  subject: Subject
}) {
  const { user } = useAuth()

  async function handleDelete() {
    if (!user) {
      return
    }

    const confirmed = window.confirm(
      `¿Eliminar ${subject.name} del horario?`,
    )

    if (!confirmed) {
      return
    }

    try {
      await removeSubject(
        user.uid,
        subject.id,
      )

      toast.success("Materia eliminada.")
    } catch (error) {
      console.error(error)
      toast.error(
        "No fue posible eliminar la materia.",
      )
    }
  }

  return (
    <article
      className="group relative overflow-hidden rounded-xl border bg-card p-3 shadow-sm"
      style={{
        borderLeftColor: subject.color,
        borderLeftWidth: "4px",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="break-words text-sm font-semibold">
            {subject.name}
          </h4>

          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {subject.startTime}–{subject.endTime}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 opacity-70 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
          onClick={() => void handleDelete()}
          aria-label={`Eliminar ${subject.name}`}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      {subject.professor && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <UserRound className="size-3.5 shrink-0" />
          <span className="truncate">
            {subject.professor}
          </span>
        </p>
      )}

      {subject.classroom && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">
            {subject.classroom}
          </span>
        </p>
      )}
    </article>
  )
}

export function WeeklySchedule({
  subjects,
  loading,
}: WeeklyScheduleProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex min-h-80 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Cargando horario...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="size-5" />
          Horario semanal
        </CardTitle>
      </CardHeader>

      <CardContent>
        {subjects.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed text-center">
            <CalendarClock className="mb-3 size-10 text-muted-foreground" />

            <p className="font-medium">
              Tu horario está vacío
            </p>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Agrega tu primera materia para comenzar
              a organizar tu semana.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:hidden">
              {weekdays.map((day) => {
                const daySubjects = subjects
                  .filter((subject) =>
                    subject.days.includes(day.value),
                  )
                  .sort((a, b) =>
                    a.startTime.localeCompare(
                      b.startTime,
                    ),
                  )

                return (
                  <section
                    key={day.value}
                    className="grid gap-3"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-semibold">
                        {day.label}
                      </h3>

                      <span className="text-xs text-muted-foreground">
                        {daySubjects.length}
                        {daySubjects.length === 1
                          ? " clase"
                          : " clases"}
                      </span>
                    </div>

                    {daySubjects.length === 0 ? (
                      <div className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
                        Sin clases
                      </div>
                    ) : (
                      daySubjects.map((subject) => (
                        <SubjectBlock
                          key={`${day.value}-${subject.id}`}
                          subject={subject}
                        />
                      ))
                    )}
                  </section>
                )
              })}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <div className="grid min-w-[980px] grid-cols-6 gap-3">
                {weekdays.map((day) => {
                  const daySubjects = subjects
                    .filter((subject) =>
                      subject.days.includes(day.value),
                    )
                    .sort((a, b) =>
                      a.startTime.localeCompare(
                        b.startTime,
                      ),
                    )

                  return (
                    <section
                      key={day.value}
                      className="min-w-0"
                    >
                      <div className="mb-3 rounded-lg bg-muted px-3 py-2 text-center">
                        <p className="font-semibold">
                          {day.shortLabel}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {daySubjects.length}
                          {daySubjects.length === 1
                            ? " clase"
                            : " clases"}
                        </p>
                      </div>

                      <div className="grid gap-3">
                        {daySubjects.length === 0 ? (
                          <div className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">
                            Sin clases
                          </div>
                        ) : (
                          daySubjects.map(
                            (subject) => (
                              <SubjectBlock
                                key={`${day.value}-${subject.id}`}
                                subject={subject}
                              />
                            ),
                          )
                        )}
                      </div>
                    </section>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
