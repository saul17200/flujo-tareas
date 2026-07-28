import { useMemo } from "react"

import { useAnalytics } from "@/features/analytics"
import { calculateAchievementProfile } from "@/features/achievements/utils/calculate-achievements"
import {
  calculateStreakProfile,
} from "@/features/streaks/utils/calculate-streak"

function getEventXp(
  metadata: Record<string, unknown> | undefined,
) {
  const xp = metadata?.xp

  return typeof xp === "number" &&
    Number.isFinite(xp)
    ? Math.max(0, xp)
    : 0
}

export function useAchievements() {
  const {
    analytics,
    events,
    loading,
    error,
  } = useAnalytics("90-days")

  const missionXp = useMemo(() => {
    const rewardedMissions =
      new Map<string, number>()

    for (const event of events) {
      if (
        event.type !==
        "daily-mission-completed"
      ) {
        continue
      }

      const missionId =
        typeof event.metadata
          ?.missionId === "string"
          ? event.metadata.missionId
          : event.id

      const dateKey =
        typeof event.metadata
          ?.dateKey === "string"
          ? event.metadata.dateKey
          : event.createdAt.slice(0, 10)

      rewardedMissions.set(
        `${dateKey}-${missionId}`,
        getEventXp(event.metadata),
      )
    }

    return [
      ...rewardedMissions.values(),
    ].reduce(
      (total, xp) => total + xp,
      0,
    )
  }, [events])

  const smartStreak = useMemo(
    () =>
      calculateStreakProfile(
        events,
        3,
      ),
    [events],
  )

  const profile = useMemo(
    () =>
      calculateAchievementProfile(
        {
          completedTasks:
            analytics.completedTasks,
          createdNotes:
            analytics.createdNotes,
          uploadedFiles:
            analytics.uploadedFiles,
          passedCourses:
            analytics.passedCourses,
          currentStreak:
            smartStreak.currentStreak,
          totalEvents:
            analytics.totalEvents,
        },
        missionXp,
      ),
    [
      analytics,
      missionXp,
      smartStreak.currentStreak,
    ],
  )

  return {
    profile,
    missionXp,
    loading,
    error,
  }
}
