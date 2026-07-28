import { useMemo } from "react"

import { useEvents } from "@/features/events"
import {
  calculateStreakProfile,
} from "@/features/streaks/utils/calculate-streak"

export function useSmartStreak(
  dailyGoal = 3,
) {
  const {
    events,
    loading,
    error,
  } = useEvents(500)

  const streak = useMemo(
    () =>
      calculateStreakProfile(
        events,
        dailyGoal,
      ),
    [dailyGoal, events],
  )

  return {
    streak,
    loading,
    error,
  }
}
