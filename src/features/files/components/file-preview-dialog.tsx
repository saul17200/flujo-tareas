import {
  Download,
  ExternalLink,
  FileQuestion,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatFileSize } from "@/features/files/utils/file-utils"
import type { SubjectFile } from "@/features/files/types/subject-file"

interface FilePreviewDialogProps {
  subjectFile: SubjectFile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function canPreviewImage(subjectFile: SubjectFile) {
  return (
    subjectFile.category === "image" ||
    subjectFile.mimeType.startsWith("image/")
  )
}

function canPreviewPdf(subjectFile: SubjectFile) {
  return (
    subjectFile.category === "pdf" ||
    subjectFile.mimeType === "application/pdf" ||
    subjectFile.extension === "pdf"
  )
}

export function FilePreviewDialog({
  subjectFile,
  open,
  onOpenChange,
}: FilePreviewDialogProps) {
  if (!subjectFile) {
    return null
  }

  const imagePreview = canPreviewImage(subjectFile)
  const pdfPreview = canPreviewPdf(subjectFile)
  const previewAvailable = imagePreview || pdfPreview

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="flex max-h-[92vh] w-[96vw] max-w-6xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b px-5 py-4 pr-14">
          <DialogTitle className="truncate">
            {subjectFile.name}
          </DialogTitle>

          <DialogDescription>
            {subjectFile.mimeType} ·{" "}
            {formatFileSize(subjectFile.size)}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-auto bg-muted/30">
          {imagePreview && (
            <div className="flex min-h-[60vh] items-center justify-center p-4 sm:p-8">
              <img
                src={subjectFile.downloadUrl}
                alt={subjectFile.name}
                className="max-h-[72vh] max-w-full rounded-lg object-contain shadow-sm"
                loading="lazy"
              />
            </div>
          )}

          {pdfPreview && (
            <div className="h-[72vh] min-h-[520px] w-full">
              <iframe
                src={subjectFile.downloadUrl}
                title={`Vista previa de ${subjectFile.name}`}
                className="h-full w-full border-0 bg-background"
              />
            </div>
          )}

          {!previewAvailable && (
            <div className="flex min-h-[55vh] flex-col items-center justify-center p-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <FileQuestion className="size-8" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Vista previa no disponible
              </h3>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Este tipo de archivo no puede visualizarse
                directamente. Puedes abrirlo o descargarlo.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
            Cerrar
          </Button>

          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={subjectFile.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              <ExternalLink className="size-4" />
              Abrir en otra pestaña
            </a>

            <a
              href={subjectFile.downloadUrl}
              download={subjectFile.originalName}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              <Download className="size-4" />
              Descargar
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
