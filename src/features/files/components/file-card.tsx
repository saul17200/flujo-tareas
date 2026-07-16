import {
  Archive,
  Code2,
  Download,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  Presentation,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatFileSize } from "@/features/files/utils/file-utils"
import type {
  SubjectFile,
  SubjectFileCategory,
} from "@/features/files/types/subject-file"

interface FileCardProps {
  subjectFile: SubjectFile
  onPreview: () => void
  onDelete: () => void
}

const categoryLabels: Record<
  SubjectFileCategory,
  string
> = {
  document: "Documento",
  pdf: "PDF",
  image: "Imagen",
  spreadsheet: "Hoja de cálculo",
  presentation: "Presentación",
  archive: "Comprimido",
  code: "Código",
  other: "Archivo",
}

function getCategoryIcon(
  category: SubjectFileCategory,
) {
  switch (category) {
    case "pdf":
    case "document":
      return FileText
    case "image":
      return FileImage
    case "spreadsheet":
      return FileSpreadsheet
    case "presentation":
      return Presentation
    case "archive":
      return Archive
    case "code":
      return Code2
    default:
      return File
  }
}

function formatDate(date: string) {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return "Fecha desconocida"
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate)
}

export function FileCard({
  subjectFile,
  onPreview,
  onDelete,
}: FileCardProps) {
  const Icon = getCategoryIcon(
    subjectFile.category,
  )

  return (
    <article className="grid gap-4 rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className="truncate font-semibold"
            title={subjectFile.name}
          >
            {subjectFile.name}
          </h3>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">
              {categoryLabels[
                subjectFile.category
              ]}
            </Badge>

            <Badge variant="outline">
              {formatFileSize(subjectFile.size)}
            </Badge>
          </div>
        </div>
      </div>

      {subjectFile.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {subjectFile.description}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Subido {formatDate(subjectFile.createdAt)}
      </p>

      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onPreview}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <FileText className="size-4" />
          Vista previa
        </button>

        <a
          href={subjectFile.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Download className="size-4" />
          Abrir
        </a>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          aria-label={`Eliminar ${subjectFile.name}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </article>
  )
}
