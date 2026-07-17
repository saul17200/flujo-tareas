import {
  useEffect,
  useState,
} from "react"
import { toast } from "sonner"

import { FileList } from "@/features/files/components/file-list"
import { FilePreviewDialog } from "@/features/files/components/file-preview-dialog"
import { FileUpload } from "@/features/files/components/file-upload"
import { useAuth } from "@/features/auth/auth-provider"
import {
  emitFileDeletedEvent,
} from "@/features/events"
import {
  observeSubjectFiles,
  removeSubjectFile,
} from "@/features/files/services/subject-files"
import type { SubjectFile } from "@/features/files/types/subject-file"

interface SubjectFilesProps {
  planId: string
  courseId: string
}

export function SubjectFiles({
  planId,
  courseId,
}: SubjectFilesProps) {
  const { user } = useAuth()

  const [files, setFiles] =
    useState<SubjectFile[]>([])
  const [previewFile, setPreviewFile] =
    useState<SubjectFile | null>(null)
  const [loading, setLoading] =
    useState(true)

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

      emitFileDeletedEvent({
        userId: user.uid,
        planId,
        courseId,
        fileId: subjectFile.id,
        name: subjectFile.name,
        mimeType: subjectFile.mimeType,
        size: subjectFile.size,
      })

      if (previewFile?.id === subjectFile.id) {
        setPreviewFile(null)
      }

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
      <FileUpload
        planId={planId}
        courseId={courseId}
      />

      <FileList
        files={files}
        loading={loading}
        onPreview={setPreviewFile}
        onDelete={(file) =>
          void handleDelete(file)
        }
      />

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
