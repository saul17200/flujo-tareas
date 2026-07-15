import { FolderOpen, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SubjectFiles() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="size-5" />
          Archivos
        </CardTitle>

        <CardDescription>
          Documentos, imágenes y recursos de la materia.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border border-dashed p-8 text-center">
          <FolderOpen className="mx-auto size-9 text-muted-foreground" />

          <p className="mt-3 font-medium">
            No hay archivos
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            La subida de archivos se activará después.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            disabled
          >
            <Upload className="size-4" />
            Subir archivo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
