import { useMemo } from "react"

import {
  analyticsRangeDays,
  type AnalyticsRange,
} from "@/features/analytics/types/analytics"
import { calculateAnalytics } from "@/features/analytics/utils/calculate-analytics"
import { useEvents } from "@/features/events"

export function useAnalytics(
  range: AnalyticsRange = "7-days",
) {
  const {
    events,
    loading,
    error,
  } = useEvents(500)

  const analytics = useMemo(
    () =>
      calculateAnalytics(
        events,
        analyticsRangeDays[range],
      ),
    [events, range],
  )

  return {
    analytics,
    events,
    loading,
    error,
  }
}
