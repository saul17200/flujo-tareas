import {
  FolderOpen,
  LoaderCircle,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileCard } from "@/features/files/components/file-card"
import type { SubjectFile } from "@/features/files/types/subject-file"

interface FileListProps {
  files: SubjectFile[]
  loading: boolean
  onPreview: (file: SubjectFile) => void
  onDelete: (file: SubjectFile) => void
}

export function FileList({
  files,
  loading,
  onPreview,
  onDelete,
}: FileListProps) {
  return (
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

            <p className="mt-1 text-sm text-muted-foreground">
              Sube el primer recurso de esta materia.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {files.map((subjectFile) => (
              <FileCard
                key={subjectFile.id}
                subjectFile={subjectFile}
                onPreview={() =>
                  onPreview(subjectFile)
                }
                onDelete={() =>
                  onDelete(subjectFile)
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
