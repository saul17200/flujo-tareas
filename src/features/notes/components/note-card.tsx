import {
  Pencil,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import type { SubjectNote } from "@/features/notes/types/subject-note"

interface NoteCardProps {
  note: SubjectNote
  active: boolean
  onEdit: () => void
  onDelete: () => void
}

function formatNoteDate(date: string) {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return "Fecha desconocida"
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate)
}

export function NoteCard({
  note,
  active,
  onEdit,
  onDelete,
}: NoteCardProps) {
  return (
    <article
      className={[
        "rounded-xl border p-3 transition-colors",
        active
          ? "border-primary bg-primary/5"
          : "hover:bg-muted/40",
      ].join(" ")}
    >
      <button
        type="button"
        className="w-full text-left"
        onClick={onEdit}
      >
        <p className="truncate font-medium">
          {note.title}
        </p>

        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {note.content || "Nota sin contenido"}
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          Actualizada {formatNoteDate(note.updatedAt)}
        </p>
      </button>

      <div className="mt-3 flex justify-end gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onEdit}
          aria-label={`Editar ${note.title}`}
        >
          <Pencil className="size-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          aria-label={`Eliminar ${note.title}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </article>
  )
}
