import type {
  MissionDefinition,
} from "@/features/missions/types/mission"

export const dailyMissionDefinitions: MissionDefinition[] = [
  {
    id: "complete-2-tasks",
    title: "Entra en ritmo",
    description: "Completa 2 tareas hoy.",
    metric: "task-completed",
    goal: 2,
    xp: 40,
  },
  {
    id: "create-1-note",
    title: "Deja evidencia",
    description: "Crea una nota hoy.",
    metric: "note-created",
    goal: 1,
    xp: 25,
  },
  {
    id: "upload-1-file",
    title: "Organiza tus recursos",
    description: "Sube un archivo hoy.",
    metric: "file-uploaded",
    goal: 1,
    xp: 25,
  },
  {
    id: "record-4-actions",
    title: "Día productivo",
    description: "Realiza 4 acciones en Drif Notion.",
    metric: "any-activity",
    goal: 4,
    xp: 50,
  },
  {
    id: "pass-1-course",
    title: "Avance académico",
    description: "Acredita una materia hoy.",
    metric: "course-passed",
    goal: 1,
    xp: 100,
  },
]
