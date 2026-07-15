import { ClipboardCheck, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SubjectExams() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="size-5" />
          Exámenes
        </CardTitle>

        <CardDescription>
          Parciales, evaluaciones y resultados.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border border-dashed p-8 text-center">
          <ClipboardCheck className="mx-auto size-9 text-muted-foreground" />

          <p className="mt-3 font-medium">
            No hay exámenes registrados
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            disabled
          >
            <Plus className="size-4" />
            Agregar examen
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
