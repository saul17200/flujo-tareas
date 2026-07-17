import {
  useRef,
  useState,
  type ChangeEvent,
} from "react"
import {
  FolderOpen,
  LoaderCircle,
  Upload,
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
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/features/auth/auth-provider"
import {
  emitFileUploadedEvent,
} from "@/features/events"
import { uploadSubjectFile } from "@/features/files/services/subject-files"
import {
  formatFileSize,
  validateSubjectFile,
} from "@/features/files/utils/file-utils"

interface FileUploadProps {
  planId: string
  courseId: string
}

export function FileUpload({
  planId,
  courseId,
}: FileUploadProps) {
  const { user } = useAuth()

  const fileInputReference =
    useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)
  const [description, setDescription] =
    useState("")
  const [uploading, setUploading] =
    useState(false)
  const [uploadProgress, setUploadProgress] =
    useState(0)

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

      const uploadedFile =
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

      emitFileUploadedEvent({
        userId: user.uid,
        planId,
        courseId,
        fileId: uploadedFile.id,
        name: uploadedFile.name,
        mimeType: uploadedFile.mimeType,
        size: uploadedFile.size,
      })

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
          ? "Firebase Storage rechazó la subida."
          : firebaseError.message ??
              "No fue posible subir el archivo.",
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="size-5" />
          Subir archivo
        </CardTitle>

        <CardDescription>
          Tamaño máximo: 25 MB.
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
            placeholder="Material de la unidad 1"
            maxLength={250}
            disabled={uploading}
          />
        </div>

        {uploading && (
          <div className="grid gap-2">
            <div className="flex justify-between text-sm">
              <span>Subiendo...</span>
              <span>{uploadProgress}%</span>
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
  )
}
