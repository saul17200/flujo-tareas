import {
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  FilePenLine,
  FilePlus2,
  FileText,
  GraduationCap,
  LoaderCircle,
  NotebookPen,
  Trash2,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEvents } from "@/features/events"
import type {
  EventType,
  UserEvent,
} from "@/features/events"

function formatRelativeDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Fecha desconocida"
  }

  const difference =
    date.getTime() - Date.now()

  const formatter =
    new Intl.RelativeTimeFormat("es-MX", {
      numeric: "auto",
    })

  const absoluteDifference =
    Math.abs(difference)

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day

  if (absoluteDifference < minute) {
    return "Ahora"
  }

  if (absoluteDifference < hour) {
    return formatter.format(
      Math.round(difference / minute),
      "minute",
    )
  }

  if (absoluteDifference < day) {
    return formatter.format(
      Math.round(difference / hour),
      "hour",
    )
  }

  if (absoluteDifference < week) {
    return formatter.format(
      Math.round(difference / day),
      "day",
    )
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

function getEventIcon(type: EventType) {
  switch (type) {
    case "note-created":
      return NotebookPen

    case "note-updated":
      return FilePenLine

    case "note-deleted":
    case "file-deleted":
    case "task-deleted":
      return Trash2

    case "file-uploaded":
      return FilePlus2

    case "file-updated":
      return FileText

    case "course-passed":
      return GraduationCap

    case "course-failed":
      return BookOpenCheck

    case "grade-updated":
    case "course-updated":
      return FilePenLine

    case "task-completed":
      return CheckCircle2

    default:
      return Clock3
  }
}

function ActivityItem({
  event,
}: {
  event: UserEvent
}) {
  const Icon = getEventIcon(event.type)

  return (
    <article className="flex gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <div className="min-w-0 flex-1 border-b pb-4 last:border-b-0">
        <p className="break-words font-medium">
          {event.title}
        </p>

        {event.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {event.description}
          </p>
        )}

        <p className="mt-2 text-xs text-muted-foreground">
          {formatRelativeDate(event.createdAt)}
        </p>
      </div>
    </article>
  )
}

export function DashboardActivityCard() {
  const {
    events,
    loading,
    error,
  } = useEvents(8)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock3 className="size-5" />
          Actividad reciente
        </CardTitle>

        <CardDescription>
          Tus cambios más recientes en Drif Notion.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex min-h-52 items-center justify-center">
            <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="font-medium">
              No fue posible cargar la actividad
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Revisa las reglas de Firestore.
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <Clock3 className="mx-auto size-9 text-muted-foreground" />

            <p className="mt-3 font-medium">
              Todavía no hay actividad
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Las notas, archivos y cambios académicos
              aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <ActivityItem
                key={event.id}
                event={event}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
