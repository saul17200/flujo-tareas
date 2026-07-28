import type {
  UserEvent,
} from "@/features/events"
import {
  dailyMissionDefinitions,
} from "@/features/missions/data/daily-missions"
import type {
  DailyMissionProfile,
  MissionMetric,
} from "@/features/missions/types/mission"

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

function countMetric(
  events: UserEvent[],
  metric: MissionMetric,
) {
  if (metric === "any-activity") {
    return events.length
  }

  return events.filter(
    (event) => event.type === metric,
  ).length
}

export function calculateDailyMissions(
  events: UserEvent[],
  date = new Date(),
): DailyMissionProfile {
  const dateKey = getDateKey(date)

  const eventsToday = events.filter(
    (event) => {
      const eventDate = new Date(
        event.createdAt,
      )

      return (
        !Number.isNaN(
          eventDate.getTime(),
        ) &&
        getDateKey(eventDate) ===
          dateKey
      )
    },
  )

  const missions =
    dailyMissionDefinitions.map(
      (mission) => {
        const progress = countMetric(
          eventsToday,
          mission.metric,
        )

        const completed =
          progress >= mission.goal

        return {
          ...mission,
          progress,
          percentage: Math.min(
            100,
            Math.round(
              (progress / mission.goal) *
                100,
            ),
          ),
          completed,
        }
      },
    )

  const completedMissions =
    missions.filter(
      (mission) =>
        mission.completed,
    )

  return {
    dateKey,
    completedCount:
      completedMissions.length,
    totalCount: missions.length,
    earnedXp:
      completedMissions.reduce(
        (total, mission) =>
          total + mission.xp,
        0,
      ),
    missions,
  }
}
