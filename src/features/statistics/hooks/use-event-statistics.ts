import { useMemo } from "react"

import { useEvents } from "@/features/events"
import {
  calculateEventStatistics,
} from "@/features/statistics/utils/event-statistics"

export function useEventStatistics() {
  const {
    events,
    loading,
    error,
  } = useEvents(250)

  const statistics = useMemo(
    () => calculateEventStatistics(events),
    [events],
  )

  return {
    statistics,
    events,
    loading,
    error,
  }
}
