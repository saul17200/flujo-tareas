import { useMemo } from "react"

import {
  useEvents,
} from "@/features/events"
import {
  buildWeeklySummary,
} from "@/features/copilot/utils/build-weekly-summary"

export function useWeeklyCopilot() {
  const {
    events,
    loading,
    error,
  } = useEvents(500)

  const summary = useMemo(
    () =>
      buildWeeklySummary(events),
    [events],
  )

  return {
    summary,
    loading,
    error,
  }
}
