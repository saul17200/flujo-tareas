import type {
  UserEvent,
} from "@/features/events"
import {
  calculateStreakProfile,
} from "@/features/streaks"
import type {
  CopilotWeeklySummary,
  WeeklyTrend,
} from "@/features/copilot/types/copilot"

function startOfLocalDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  )
}

function getWeekStart(date: Date) {
  const result = startOfLocalDay(date)
  const day = result.getDay()

  result.setDate(
    result.getDate() +
      (day === 0 ? -6 : 1 - day),
  )

  return result
}

function getDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0")
  const day = String(
    date.getDate(),
  ).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function parseEventDate(event: UserEvent) {
  const date = new Date(event.createdAt)

  return Number.isNaN(date.getTime())
    ? null
    : date
}

function isBetween(
  date: Date,
  start: Date,
  end: Date,
) {
  return date >= start && date < end
}

function getEventXp(event: UserEvent) {
  const xp = event.metadata?.xp

  return typeof xp === "number" &&
    Number.isFinite(xp)
    ? Math.max(0, xp)
    : 0
}

function getTrend(
  current: number,
  previous: number,
): WeeklyTrend {
  if (current > previous) {
    return "up"
  }

  if (current < previous) {
    return "down"
  }

  return "stable"
}

function getChangePercentage(
  current: number,
  previous: number,
) {
  if (previous === 0) {
    return current > 0 ? 100 : null
  }

  return Math.round(
    ((current - previous) /
      previous) *
      100,
  )
}

function findMostActiveDay(
  events: UserEvent[],
) {
  const counts = new Map<string, number>()
  const labels = new Map<string, string>()

  const formatter =
    new Intl.DateTimeFormat("es-MX", {
      weekday: "long",
    })

  for (const event of events) {
    const date = parseEventDate(event)

    if (!date) {
      continue
    }

    const key = getDateKey(date)

    counts.set(
      key,
      (counts.get(key) ?? 0) + 1,
    )

    labels.set(
      key,
      formatter.format(date),
    )
  }

  let bestKey: string | null = null
  let bestTotal = 0

  for (const [key, total] of counts) {
    if (total > bestTotal) {
      bestKey = key
      bestTotal = total
    }
  }

  return bestKey
    ? labels.get(bestKey) ?? null
    : null
}

function buildHighlight(
  completedTasks: number,
  earnedXp: number,
  completedGoalDays: number,
) {
  if (completedTasks > 0) {
    return `Completaste ${completedTasks} ${
      completedTasks === 1
        ? "tarea"
        : "tareas"
    } esta semana.`
  }

  if (completedGoalDays > 0) {
    return `Protegiste tu meta diaria durante ${completedGoalDays} ${
      completedGoalDays === 1
        ? "día"
        : "días"
    }.`
  }

  if (earnedXp > 0) {
    return `Ganaste ${earnedXp} XP durante la semana.`
  }

  return "Todavía puedes registrar tu primer avance de la semana."
}

function buildRisk(
  currentActivity: number,
  completedTasks: number,
  completedGoalDays: number,
) {
  if (currentActivity === 0) {
    return "No se ha registrado actividad durante esta semana."
  }

  if (completedTasks === 0) {
    return "No has completado tareas durante esta semana."
  }

  if (completedGoalDays < 2) {
    return "La meta diaria se ha protegido menos de dos días."
  }

  return null
}

function buildRecommendation(
  risk: string | null,
  trend: WeeklyTrend,
  completedGoalDays: number,
) {
  if (
    risk ===
    "No se ha registrado actividad durante esta semana."
  ) {
    return "Comienza con una acción pequeña: crea una nota o completa una tarea corta."
  }

  if (
    risk ===
    "No has completado tareas durante esta semana."
  ) {
    return "Elige la tarea con la fecha de entrega más cercana y divídela en un primer paso."
  }

  if (completedGoalDays < 3) {
    return "Busca cumplir la meta diaria de tres acciones al menos tres días la próxima semana."
  }

  if (trend === "down") {
    return "Reduce la carga inicial y prioriza constancia antes que cantidad."
  }

  if (trend === "up") {
    return "Mantén el ritmo actual y adelanta una tarea antes de su fecha límite."
  }

  return "Conserva tu ritmo y completa primero las tareas de mayor prioridad."
}

export function buildWeeklySummary(
  events: UserEvent[],
  now = new Date(),
): CopilotWeeklySummary {
  const currentWeekStart =
    getWeekStart(now)

  const currentWeekEnd =
    new Date(currentWeekStart)

  currentWeekEnd.setDate(
    currentWeekEnd.getDate() + 7,
  )

  const previousWeekStart =
    new Date(currentWeekStart)

  previousWeekStart.setDate(
    previousWeekStart.getDate() - 7,
  )

  const currentEvents =
    events.filter((event) => {
      const date = parseEventDate(event)

      return (
        date !== null &&
        isBetween(
          date,
          currentWeekStart,
          currentWeekEnd,
        )
      )
    })

  const previousEvents =
    events.filter((event) => {
      const date = parseEventDate(event)

      return (
        date !== null &&
        isBetween(
          date,
          previousWeekStart,
          currentWeekStart,
        )
      )
    })

  const completedTasks =
    currentEvents.filter(
      (event) =>
        event.type ===
        "task-completed",
    ).length

  const earnedXp =
    currentEvents.reduce(
      (total, event) =>
        total + getEventXp(event),
      0,
    )

  const currentWeekActivity =
    currentEvents.length

  const previousWeekActivity =
    previousEvents.length

  const trend = getTrend(
    currentWeekActivity,
    previousWeekActivity,
  )

  const streak =
    calculateStreakProfile(
      currentEvents,
      3,
    )

  const completedGoalDays =
    streak.completedDays

  const risk = buildRisk(
    currentWeekActivity,
    completedTasks,
    completedGoalDays,
  )

  return {
    currentWeekActivity,
    previousWeekActivity,
    changePercentage:
      getChangePercentage(
        currentWeekActivity,
        previousWeekActivity,
      ),
    trend,
    completedTasks,
    earnedXp,
    completedGoalDays,
    mostActiveDay:
      findMostActiveDay(
        currentEvents,
      ),
    highlight: buildHighlight(
      completedTasks,
      earnedXp,
      completedGoalDays,
    ),
    risk,
    recommendation:
      buildRecommendation(
        risk,
        trend,
        completedGoalDays,
      ),
  }
}
