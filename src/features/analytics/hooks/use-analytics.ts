import { useMemo } from "react"

import { useEvents } from "@/features/events"
import { calculateAnalytics } from "@/features/analytics/utils/calculate-analytics"

export function useAnalytics() {
  const {
    events,
    loading,
    error,
  } = useEvents(500)

  const analytics = useMemo(
    () => calculateAnalytics(events),
    [events],
  )

  return {
    analytics,
    events,
    loading,
    error,
  }
}
