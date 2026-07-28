import { useMemo } from "react"

import {
  useEvents,
} from "@/features/events"
import {
  calculateLeagueProfile,
} from "@/features/leagues/utils/calculate-league"

function getWeekStart(date: Date) {
  const result = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  )

  const day = result.getDay()
  const difference =
    day === 0 ? -6 : 1 - day

  result.setDate(
    result.getDate() + difference,
  )

  return result
}

function getEventXp(
  metadata:
    | Record<string, unknown>
    | undefined,
) {
  const xp = metadata?.xp

  return typeof xp === "number" &&
    Number.isFinite(xp)
    ? Math.max(0, xp)
    : 0
}

export function useLeague() {
  const {
    events,
    loading,
    error,
  } = useEvents(500)

  const weeklyXp = useMemo(() => {
    const weekStart =
      getWeekStart(new Date())

    return events.reduce(
      (total, event) => {
        const eventDate =
          new Date(event.createdAt)

        if (
          Number.isNaN(
            eventDate.getTime(),
          ) ||
          eventDate < weekStart
        ) {
          return total
        }

        if (
          event.type !==
            "achievement-unlocked" &&
          event.type !==
            "daily-mission-completed"
        ) {
          return total
        }

        return (
          total +
          getEventXp(event.metadata)
        )
      },
      0,
    )
  }, [events])

  const profile = useMemo(
    () =>
      calculateLeagueProfile(
        weeklyXp,
      ),
    [weeklyXp],
  )

  return {
    profile,
    events,
    loading,
    error,
  }
}
