import {
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  exportTasksToExcel,
  exportTasksToPdf,
} from "@/services/export-tasks"
import { useTaskStore } from "@/store/task-store"

export function ExportMenu() {
  const tasks = useTaskStore((state) => state.tasks)

  function handleExcelExport() {
    try {
      exportTasksToExcel(tasks)
      toast.success("Archivo de Excel generado.")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No fue posible exportar las tareas.",
      )
    }
  }

  function handlePdfExport() {
    try {
      exportTasksToPdf(tasks)
      toast.success("Archivo PDF generado.")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No fue posible exportar las tareas.",
      )
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={tasks.length === 0}
          />
        }
      >
        <Download className="size-4" />
        Exportar
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExcelExport}>
          <FileSpreadsheet className="size-4" />
          Exportar a Excel
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handlePdfExport}>
          <FileText className="size-4" />
          Exportar a PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
