import { useMemo } from "react"

import { useAnalytics } from "@/features/analytics"
import { calculateAchievementProfile } from "@/features/achievements/utils/calculate-achievements"

export function useAchievements() {
  const {
    analytics,
    loading,
    error,
  } = useAnalytics("90-days")

  const profile = useMemo(
    () =>
      calculateAchievementProfile({
        completedTasks:
          analytics.completedTasks,
        createdNotes:
          analytics.createdNotes,
        uploadedFiles:
          analytics.uploadedFiles,
        passedCourses:
          analytics.passedCourses,
        currentStreak:
          analytics.currentStreak,
        totalEvents:
          analytics.totalEvents,
      }),
    [analytics],
  )

  return {
    profile,
    loading,
    error,
  }
}
