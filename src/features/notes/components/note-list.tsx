import {
  FileText,
  Plus,
} from "lucide-react"

import { NoteCard } from "@/features/notes/components/note-card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { SubjectNote } from "@/features/notes/types/subject-note"

interface NoteListProps {
  notes: SubjectNote[]
  selectedNoteId: string | null
  loading: boolean
  onCreate: () => void
  onEdit: (note: SubjectNote) => void
  onDelete: (note: SubjectNote) => void
}

export function NoteList({
  notes,
  selectedNoteId,
  loading,
  onCreate,
  onEdit,
  onDelete,
}: NoteListProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Notas</CardTitle>

            <CardDescription>
              {notes.length === 1
                ? "1 nota guardada"
                : `${notes.length} notas guardadas`}
            </CardDescription>
          </div>

          <Button
            type="button"
            size="icon"
            onClick={onCreate}
            aria-label="Crear nota"
            title="Nueva nota"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[480px] pr-3">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              Cargando notas...
            </div>
          ) : notes.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed text-center">
              <FileText className="size-8 text-muted-foreground" />

              <p className="mt-3 font-medium">
                No hay notas
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Crea el primer apunte de esta materia.
              </p>
            </div>
          ) : (
            <div className="grid gap-2">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  active={
                    note.id === selectedNoteId
                  }
                  onEdit={() => onEdit(note)}
                  onDelete={() => onDelete(note)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
