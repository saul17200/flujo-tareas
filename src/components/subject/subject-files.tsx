import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react"
import {
  Archive,
  Code2,
  Download,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  LoaderCircle,
  Presentation,
  Trash2,
  Upload,
} from "lucide-react"
import { toast } from "sonner"

import { FilePreviewDialog } from "@/components/subject/file-preview-dialog"
import { Badge } from "@/components/ui/badge"
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
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/features/auth/auth-provider"
import {
  formatFileSize,
  validateSubjectFile,
} from "@/lib/file-utils"
import {
  observeSubjectFiles,
  removeSubjectFile,
  uploadSubjectFile,
} from "@/services/subject-files"
import type {
  SubjectFile,
  SubjectFileCategory,
} from "@/types/subject-file"

interface SubjectFilesProps {
  planId: string
  courseId: string
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
  archive: "Archivo comprimido",
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate)
}

export function SubjectFiles({
  planId,
  courseId,
}: SubjectFilesProps) {
  const { user } = useAuth()

  const fileInputReference =
    useRef<HTMLInputElement>(null)

  const [files, setFiles] = useState<
    SubjectFile[]
  >([])
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)
  const [previewFile, setPreviewFile] =
    useState<SubjectFile | null>(null)
  const [description, setDescription] =
    useState("")
  const [loading, setLoading] =
    useState(true)
  const [uploading, setUploading] =
    useState(false)
  const [uploadProgress, setUploadProgress] =
    useState(0)

  useEffect(() => {
    if (!user) {
      setFiles([])
      setLoading(false)
      return
    }

    setLoading(true)

    return observeSubjectFiles(
      user.uid,
      planId,
      courseId,
      (nextFiles) => {
        setFiles(nextFiles)
        setLoading(false)
      },
      (error) => {
        console.error(
          "Error al cargar archivos:",
          error,
        )

        setLoading(false)

        toast.error(
          "No fue posible cargar los archivos.",
        )
      },
    )
  }, [courseId, planId, user])

  function resetUploadForm() {
    setSelectedFile(null)
    setDescription("")
    setUploadProgress(0)

    if (fileInputReference.current) {
      fileInputReference.current.value = ""
    }
  }

  function handleFileSelection(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null

    if (!file) {
      return
    }

    try {
      validateSubjectFile(file)
      setSelectedFile(file)
    } catch (error) {
      resetUploadForm()

      toast.error(
        error instanceof Error
          ? error.message
          : "El archivo no es válido.",
      )
    }
  }

  async function handleUpload() {
    if (!user) {
      toast.error("No hay una sesión activa.")
      return
    }

    if (!selectedFile) {
      toast.error(
        "Selecciona un archivo para subir.",
      )
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)

      await uploadSubjectFile(
        user.uid,
        planId,
        courseId,
        {
          file: selectedFile,
          description,
        },
        (progress) => {
          setUploadProgress(
            progress.percentage,
          )
        },
      )

      toast.success("Archivo subido.", {
        description: selectedFile.name,
      })

      resetUploadForm()
    } catch (error) {
      console.error(
        "Error al subir el archivo:",
        error,
      )

      const firebaseError = error as {
        code?: string
        message?: string
      }

      toast.error(
        firebaseError.code ===
          "storage/unauthorized"
          ? "Firebase Storage rechazó la subida. Revisa sus reglas."
          : firebaseError.message ??
              "No fue posible subir el archivo.",
      )
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(
    subjectFile: SubjectFile,
  ) {
    if (!user) {
      return
    }

    const confirmed = window.confirm(
      `¿Eliminar "${subjectFile.name}"?`,
    )

    if (!confirmed) {
      return
    }

    try {
      await removeSubjectFile(
        user.uid,
        planId,
        courseId,
        subjectFile,
      )

      toast.success("Archivo eliminado.")
    } catch (error) {
      console.error(
        "Error al eliminar el archivo:",
        error,
      )

      toast.error(
        "No fue posible eliminar el archivo.",
      )
    }
  }

  return (
    <section className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="size-5" />
            Subir archivo
          </CardTitle>

          <CardDescription>
            Agrega documentos, imágenes, hojas de
            cálculo, presentaciones, código o archivos
            comprimidos. Tamaño máximo: 25 MB.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-5">
          <input
            ref={fileInputReference}
            type="file"
            className="hidden"
            onChange={handleFileSelection}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.csv,.jpg,.jpeg,.png,.webp,.gif,.zip,.rar,.7z,.html,.css,.js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.sql"
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() =>
              fileInputReference.current?.click()
            }
            className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center transition-colors hover:border-primary hover:bg-primary/5 disabled:pointer-events-none disabled:opacity-50"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FolderOpen className="size-7" />
            </div>

            <p className="mt-4 font-semibold">
              {selectedFile
                ? selectedFile.name
                : "Seleccionar archivo"}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {selectedFile
                ? formatFileSize(
                    selectedFile.size,
                  )
                : "Pulsa aquí para buscar un archivo"}
            </p>
          </button>

          <div className="grid gap-2">
            <Label htmlFor="file-description">
              Descripción opcional
            </Label>

            <Input
              id="file-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Ejemplo: material de la unidad 1"
              maxLength={250}
              disabled={uploading}
            />
          </div>

          {uploading && (
            <div className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span>Subiendo archivo...</span>

                <span className="font-medium">
                  {uploadProgress}%
                </span>
              </div>

              <Progress value={uploadProgress} />
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={
                uploading || !selectedFile
              }
              onClick={resetUploadForm}
            >
              Limpiar
            </Button>

            <button
              type="button"
              disabled={
                uploading || !selectedFile
              }
              onClick={() =>
                void handleUpload()
              }
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:pointer-events-none disabled:opacity-50"
            >
              {uploading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}

              {uploading
                ? `Subiendo ${uploadProgress}%`
                : "Subir archivo"}
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="size-5" />
            Archivos de la materia
          </CardTitle>

          <CardDescription>
            {files.length === 1
              ? "1 archivo guardado"
              : `${files.length} archivos guardados`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex min-h-56 items-center justify-center">
              <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : files.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
              <FolderOpen className="size-10 text-muted-foreground" />

              <p className="mt-4 font-medium">
                No hay archivos
              </p>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Selecciona y sube el primer recurso
                de esta materia.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {files.map((subjectFile) => (
                <SubjectFileCard
                  key={subjectFile.id}
                  subjectFile={subjectFile}
                  onPreview={() =>
                    setPreviewFile(subjectFile)
                  }
                  onDelete={() =>
                    void handleDelete(
                      subjectFile,
                    )
                  }
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <FilePreviewDialog
        subjectFile={previewFile}
        open={previewFile !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setPreviewFile(null)
          }
        }}
      />
    </section>
  )
}

interface SubjectFileCardProps {
  subjectFile: SubjectFile
  onPreview: () => void
  onDelete: () => void
}

function SubjectFileCard({
  subjectFile,
  onPreview,
  onDelete,
}: SubjectFileCardProps) {
  const Icon = getCategoryIcon(
    subjectFile.category,
  )

  return (
    <article className="group grid gap-4 rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm">
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
              {formatFileSize(
                subjectFile.size,
              )}
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
          title="Eliminar archivo"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </article>
  )
}
