import { FileText, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SubjectNotes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          Notas
        </CardTitle>

        <CardDescription>
          Apuntes y contenido personal de la materia.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border border-dashed p-8 text-center">
          <FileText className="mx-auto size-9 text-muted-foreground" />

          <p className="mt-3 font-medium">
            Todavía no hay notas
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            En la siguiente fase podrás crear apuntes.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            disabled
          >
            <Plus className="size-4" />
            Nueva nota
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
