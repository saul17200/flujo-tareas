import { useMemo } from "react"

import { useEvents } from "@/features/events"
import {
  calculateDailyMissions,
} from "@/features/missions/utils/calculate-daily-missions"

export function useDailyMissions() {
  const {
    events,
    loading,
    error,
  } = useEvents(500)

  const profile = useMemo(
    () =>
      calculateDailyMissions(events),
    [events],
  )

  return {
    profile,
    loading,
    error,
  }
}
