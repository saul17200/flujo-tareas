import {
  useState,
  type FormEvent,
} from "react"
import {
  BookOpen,
  Clock3,
  MapPin,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/features/auth/auth-provider"
import { createSubject } from "@/services/subjects"
import type {
  Weekday,
} from "@/types/subject"

const weekdayOptions: {
  value: Weekday
  label: string
}[] = [
  { value: "monday", label: "Lunes" },
  { value: "tuesday", label: "Martes" },
  { value: "wednesday", label: "Miércoles" },
  { value: "thursday", label: "Jueves" },
  { value: "friday", label: "Viernes" },
  { value: "saturday", label: "Sábado" },
]

const subjectColors = [
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#ef4444",
  "#22c55e",
  "#64748b",
]

export function SubjectForm() {
  const { user } = useAuth()

  const [name, setName] = useState("")
  const [professor, setProfessor] = useState("")
  const [classroom, setClassroom] = useState("")
  const [period, setPeriod] = useState("")
  const [color, setColor] = useState(
    subjectColors[0],
  )
  const [days, setDays] = useState<Weekday[]>([])
  const [startTime, setStartTime] =
    useState("08:00")
  const [endTime, setEndTime] =
    useState("10:00")
  const [saving, setSaving] = useState(false)

  function toggleDay(day: Weekday) {
    setDays((currentDays) =>
      currentDays.includes(day)
        ? currentDays.filter(
            (currentDay) => currentDay !== day,
          )
        : [...currentDays, day],
    )
  }

  function resetForm() {
    setName("")
    setProfessor("")
    setClassroom("")
    setDays([])
    setStartTime("08:00")
    setEndTime("10:00")
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!user) {
      return
    }

    if (name.trim().length < 2) {
      toast.error("Escribe el nombre de la materia.")
      return
    }

    if (days.length === 0) {
      toast.error(
        "Selecciona al menos un día de clase.",
      )
      return
    }

    if (startTime >= endTime) {
      toast.error(
        "La hora de salida debe ser posterior a la hora de entrada.",
      )
      return
    }

    try {
      setSaving(true)

      await createSubject(user.uid, {
        name,
        professor,
        classroom,
        period,
        color,
        days,
        startTime,
        endTime,
      })

      resetForm()
      toast.success("Materia agregada al horario.")
    } catch (error) {
      console.error(error)
      toast.error(
        "No fue posible guardar la materia.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar materia</CardTitle>

        <CardDescription>
          Registra la información y los días de clase.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="grid gap-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="subject-name">
                Materia
              </Label>

              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="subject-name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Cálculo diferencial"
                  className="pl-9"
                  maxLength={80}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject-professor">
                Profesor
              </Label>

              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="subject-professor"
                  value={professor}
                  onChange={(event) =>
                    setProfessor(event.target.value)
                  }
                  placeholder="Nombre del profesor"
                  className="pl-9"
                  maxLength={80}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject-classroom">
                Aula o salón
              </Label>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="subject-classroom"
                  value={classroom}
                  onChange={(event) =>
                    setClassroom(event.target.value)
                  }
                  placeholder="Aula B-204"
                  className="pl-9"
                  maxLength={50}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject-period">
                Periodo escolar
              </Label>

              <Input
                id="subject-period"
                value={period}
                onChange={(event) =>
                  setPeriod(event.target.value)
                }
                placeholder="Agosto - Diciembre 2026"
                maxLength={60}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="start-time">
                Hora de entrada
              </Label>

              <div className="relative">
                <Clock3 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(event) =>
                    setStartTime(event.target.value)
                  }
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="end-time">
                Hora de salida
              </Label>

              <div className="relative">
                <Clock3 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(event) =>
                    setEndTime(event.target.value)
                  }
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Días de clase</Label>

            <div className="flex flex-wrap gap-2">
              {weekdayOptions.map((day) => {
                const selected = days.includes(
                  day.value,
                )

                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() =>
                      toggleDay(day.value)
                    }
                    className={[
                      "rounded-full border px-4 py-2",
                      "text-sm font-medium transition-colors",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted",
                    ].join(" ")}
                  >
                    {day.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Color de la materia</Label>

            <div className="flex flex-wrap gap-3">
              {subjectColors.map((subjectColor) => (
                <button
                  key={subjectColor}
                  type="button"
                  onClick={() =>
                    setColor(subjectColor)
                  }
                  aria-label={`Seleccionar color ${subjectColor}`}
                  className={[
                    "size-9 rounded-full transition-transform",
                    color === subjectColor
                      ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "hover:scale-105",
                  ].join(" ")}
                  style={{
                    backgroundColor: subjectColor,
                  }}
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full sm:w-fit"
          >
            <BookOpen className="size-4" />

            {saving
              ? "Guardando..."
              : "Agregar materia"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
