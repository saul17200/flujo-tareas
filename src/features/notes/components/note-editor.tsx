import {
  forwardRef,
} from "react"
import {
  Save,
  X,
} from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"

interface NoteEditorProps {
  editing: boolean
  title: string
  content: string
  saving: boolean
  onTitleChange: (value: string) => void
  onContentChange: (value: string) => void
  onClear: () => void
  onSave: () => void
}

export const NoteEditor = forwardRef<
  HTMLInputElement,
  NoteEditorProps
>(function NoteEditor(
  {
    editing,
    title,
    content,
    saving,
    onTitleChange,
    onContentChange,
    onClear,
    onSave,
  },
  titleInputReference,
) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editing
            ? "Editar nota"
            : "Nueva nota"}
        </CardTitle>

        <CardDescription>
          {editing
            ? "Modifica el contenido y guarda los cambios."
            : "Guarda apuntes, resúmenes, enlaces o recordatorios."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="note-title">
              Título
            </Label>

            <Input
              ref={titleInputReference}
              id="note-title"
              value={title}
              onChange={(event) =>
                onTitleChange(event.target.value)
              }
              placeholder="Unidad 1: Introducción"
              maxLength={120}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note-content">
              Contenido
            </Label>

            <Textarea
              id="note-content"
              value={content}
              onChange={(event) =>
                onContentChange(event.target.value)
              }
              placeholder="Escribe tus apuntes..."
              className="min-h-[340px] resize-y"
              maxLength={20000}
            />

            <p className="text-right text-xs text-muted-foreground">
              {content.length}/20000
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClear}
              disabled={saving}
            >
              <X className="size-4" />

              {editing
                ? "Cancelar edición"
                : "Limpiar"}
            </Button>

            <button
              type="button"
              disabled={saving}
              onClick={onSave}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:pointer-events-none disabled:opacity-50"
            >
              <Save className="size-4" />

              {saving
                ? "Guardando..."
                : editing
                  ? "Guardar cambios"
                  : "Crear nota"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
