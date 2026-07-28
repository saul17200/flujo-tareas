import type {
  AchievementProfileData,
} from "@/features/achievements"
import type {
  LeagueProfile,
} from "@/features/leagues"
import type {
  DailyMissionProfile,
} from "@/features/missions"
import type {
  StreakProfile,
} from "@/features/streaks"
import type {
  CopilotRecommendation,
  CopilotSummary,
} from "@/features/copilot/types/copilot"
import type {
  Task,
} from "@/types/task"

interface BuildCopilotSummaryInput {
  userName?: string | null
  tasks: Task[]
  achievementProfile: AchievementProfileData
  leagueProfile: LeagueProfile
  missionProfile: DailyMissionProfile
  streakProfile: StreakProfile
  now?: Date
}

function getGreeting(
  userName: string | null | undefined,
  now: Date,
) {
  const hour = now.getHours()

  const period =
    hour < 12
      ? "Buenos días"
      : hour < 19
        ? "Buenas tardes"
        : "Buenas noches"

  const name = userName?.trim()

  return name
    ? `${period}, ${name}`
    : period
}

function parseDate(value: string | null) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? null
    : date
}

function buildTaskRecommendations(
  tasks: Task[],
  now: Date,
) {
  const recommendations:
    CopilotRecommendation[] = []

  const pendingTasks = tasks
    .filter(
      (task) =>
        task.status !== "completed",
    )
    .map((task) => ({
      task,
      dueDate: parseDate(task.dueDate),
    }))
    .filter(
      (
        item,
      ): item is {
        task: Task
        dueDate: Date
      } => item.dueDate !== null,
    )
    .sort(
      (first, second) =>
        first.dueDate.getTime() -
        second.dueDate.getTime(),
    )

  const nextTask = pendingTasks[0]

  if (!nextTask) {
    return recommendations
  }

  const difference =
    nextTask.dueDate.getTime() -
    now.getTime()

  const hours =
    difference / (60 * 60 * 1000)

  if (hours < 0) {
    recommendations.push({
      id: `overdue-${nextTask.task.id}`,
      kind: "urgent-task",
      priority: "high",
      title: "Tienes una tarea atrasada",
      description:
        `Prioriza “${nextTask.task.title}” para ponerte al corriente.`,
      destination: "/tareas",
    })

    return recommendations
  }

  if (hours <= 24) {
    recommendations.push({
      id: `due-today-${nextTask.task.id}`,
      kind: "urgent-task",
      priority: "high",
      title: "Entrega próxima",
      description:
        `“${nextTask.task.title}” vence durante las próximas 24 horas.`,
      destination: "/tareas",
    })

    return recommendations
  }

  if (hours <= 72) {
    recommendations.push({
      id: `upcoming-${nextTask.task.id}`,
      kind: "upcoming-task",
      priority: "medium",
      title: "Prepárate con anticipación",
      description:
        `Empieza “${nextTask.task.title}”; vence en menos de tres días.`,
      destination: "/tareas",
    })
  }

  return recommendations
}

export function buildCopilotSummary({
  userName,
  tasks,
  achievementProfile,
  leagueProfile,
  missionProfile,
  streakProfile,
  now = new Date(),
}: BuildCopilotSummaryInput): CopilotSummary {
  const recommendations:
    CopilotRecommendation[] = [
      ...buildTaskRecommendations(
        tasks,
        now,
      ),
    ]

  const missingStreakActions =
    Math.max(
      0,
      streakProfile.dailyGoal -
        streakProfile.todayActivity,
    )

  if (
    !streakProfile.todayCompleted &&
    missingStreakActions > 0
  ) {
    recommendations.push({
      id: "protect-streak",
      kind: "streak",
      priority:
        missingStreakActions === 1
          ? "high"
          : "medium",
      title: "Protege tu racha",
      description:
        missingStreakActions === 1
          ? "Te falta una acción válida para cumplir tu meta de hoy."
          : `Te faltan ${missingStreakActions} acciones para cumplir tu meta diaria.`,
      destination: "/",
    })
  }

  const easiestMission =
    missionProfile.missions
      .filter(
        (mission) =>
          !mission.completed,
      )
      .sort((first, second) => {
        const firstRemaining =
          first.goal - first.progress

        const secondRemaining =
          second.goal - second.progress

        return (
          firstRemaining -
          secondRemaining
        )
      })[0]

  if (easiestMission) {
    recommendations.push({
      id: `mission-${easiestMission.id}`,
      kind: "mission",
      priority: "medium",
      title: "Completa una misión rápida",
      description:
        `${easiestMission.description} Ganarás ${easiestMission.xp} XP.`,
      destination: "/",
    })
  }

  const xpToNextLevel =
    Math.max(
      0,
      achievementProfile.nextLevelXp -
        achievementProfile.currentLevelXp,
    )

  if (xpToNextLevel > 0) {
    recommendations.push({
      id: "next-level",
      kind: "level",
      priority: "low",
      title:
        `Estás cerca del nivel ${achievementProfile.level + 1}`,
      description:
        `Necesitas ${xpToNextLevel} XP para subir de nivel.`,
      destination: "/logros",
    })
  }

  if (leagueProfile.nextLeague) {
    recommendations.push({
      id: "next-league",
      kind: "league",
      priority: "low",
      title:
        `Camino a Liga ${leagueProfile.nextLeague.name}`,
      description:
        `Te faltan ${leagueProfile.xpToNextLeague} XP esta semana.`,
      destination: "/ligas",
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: "all-clear",
      kind: "productivity",
      priority: "low",
      title: "Todo está bajo control",
      description:
        "No tienes urgencias. Aprovecha para avanzar una tarea o crear una nota.",
      destination: "/tareas",
    })
  }

  const priorityOrder = {
    high: 0,
    medium: 1,
    low: 2,
  } as const

  recommendations.sort(
    (first, second) =>
      priorityOrder[first.priority] -
      priorityOrder[second.priority],
  )

  const urgentCount =
    recommendations.filter(
      (recommendation) =>
        recommendation.priority ===
        "high",
    ).length

  return {
    greeting: getGreeting(
      userName,
      now,
    ),
    headline:
      urgentCount > 0
        ? "Hay asuntos que necesitan tu atención"
        : "Este es tu mejor siguiente paso",
    recommendations:
      recommendations.slice(0, 5),
    urgentCount,
  }
}
