import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

import type { Task, TaskPriority, TaskStatus } from "@/types/task"

const statusLabels: Record<TaskStatus, string> = {
  pending: "Pendiente",
  completed: "Completada",
}

const priorityLabels: Record<TaskPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
}

function formatDate(date: string | null) {
  if (!date) {
    return "Sin fecha"
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`))
}

function getExportRows(tasks: Task[]) {
  return tasks.map((task) => ({
    Tarea: task.title,
    Descripción: task.description || "Sin descripción",
    Estado: statusLabels[task.status],
    Prioridad: priorityLabels[task.priority],
    "Fecha límite": formatDate(task.dueDate),
    Creada: new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(task.createdAt)),
  }))
}

export function exportTasksToExcel(tasks: Task[]) {
  if (tasks.length === 0) {
    throw new Error("No hay tareas para exportar.")
  }

  const rows = getExportRows(tasks)
  const worksheet = XLSX.utils.json_to_sheet(rows)

  worksheet["!cols"] = [
    { wch: 28 },
    { wch: 45 },
    { wch: 14 },
    { wch: 12 },
    { wch: 16 },
    { wch: 20 },
  ]

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Tareas",
  )

  XLSX.writeFile(
    workbook,
    `FlujoTareas-${new Date().toISOString().slice(0, 10)}.xlsx`,
  )
}

export function exportTasksToPdf(tasks: Task[]) {
  if (tasks.length === 0) {
    throw new Error("No hay tareas para exportar.")
  }

  const document = new jsPDF({
    orientation: "landscape",
  })

  document.setFontSize(18)
  document.text("FlujoTareas", 14, 18)

  document.setFontSize(10)
  document.text(
    `Reporte generado: ${new Intl.DateTimeFormat("es-MX", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date())}`,
    14,
    25,
  )

  autoTable(document, {
    startY: 32,
    head: [[
      "Tarea",
      "Descripción",
      "Estado",
      "Prioridad",
      "Fecha límite",
      "Creada",
    ]],
    body: getExportRows(tasks).map((row) => [
      row.Tarea,
      row.Descripción,
      row.Estado,
      row.Prioridad,
      row["Fecha límite"],
      row.Creada,
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [35, 35, 35],
    },
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 75 },
      2: { cellWidth: 25 },
      3: { cellWidth: 22 },
      4: { cellWidth: 28 },
      5: { cellWidth: 34 },
    },
  })

  document.save(
    `FlujoTareas-${new Date().toISOString().slice(0, 10)}.pdf`,
  )
}
