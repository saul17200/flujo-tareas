import type {
  UserEvent,
} from "@/features/events"
import type {
  AnalyticsSummary,
  DailyActivity,
  EventTypeCount,
} from "@/features/analytics/types/analytics"

function startOfLocalDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  )
}

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

function parseEventDate(event: UserEvent) {
  const date = new Date(event.createdAt)

  return Number.isNaN(date.getTime())
    ? null
    : date
}

function calculateCurrentStreak(
  events: UserEvent[],
) {
  const activeDays = new Set<string>()

  for (const event of events) {
    const date = parseEventDate(event)

    if (date) {
      activeDays.add(getDateKey(date))
    }
  }

  if (activeDays.size === 0) {
    return 0
  }

  const today = startOfLocalDay(new Date())
  const yesterday = new Date(today)

  yesterday.setDate(
    yesterday.getDate() - 1,
  )

  let cursor: Date | null =
    activeDays.has(getDateKey(today))
      ? today
      : activeDays.has(getDateKey(yesterday))
        ? yesterday
        : null

  if (!cursor) {
    return 0
  }

  let streak = 0

  while (
    activeDays.has(getDateKey(cursor))
  ) {
    streak += 1

    cursor = new Date(cursor)
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function buildDailyActivity(
  events: UserEvent[],
  days: number,
): DailyActivity[] {
  const weekdayFormatter =
    new Intl.DateTimeFormat("es-MX", {
      weekday: "short",
    })

  const dateFormatter =
    new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "short",
    })

  const counts = new Map<string, number>()

  for (const event of events) {
    const eventDate = parseEventDate(event)

    if (!eventDate) {
      continue
    }

    const key = getDateKey(eventDate)

    counts.set(
      key,
      (counts.get(key) ?? 0) + 1,
    )
  }

  const today = startOfLocalDay(new Date())

  return Array.from(
    { length: days },
    (_, index) => {
      const date = new Date(today)

      date.setDate(
        today.getDate() -
          (days - index - 1),
      )

      const dateKey = getDateKey(date)

      return {
        date: dateKey,
        label:
          days <= 7
            ? weekdayFormatter
                .format(date)
                .replace(".", "")
            : dateFormatter.format(date),
        total: counts.get(dateKey) ?? 0,
      }
    },
  )
}

function countEventsBetween(
  events: UserEvent[],
  start: Date,
  end: Date,
) {
  return events.filter((event) => {
    const date = parseEventDate(event)

    return (
      date !== null &&
      date >= start &&
      date < end
    )
  }).length
}

function findMostActiveDay(
  dailyActivity: DailyActivity[],
) {
  const highest = dailyActivity.reduce<
    DailyActivity | null
  >((current, day) => {
    if (
      !current ||
      day.total > current.total
    ) {
      return day
    }

    return current
  }, null)

  return highest && highest.total > 0
    ? highest.label
    : null
}

function findMostActiveHour(
  events: UserEvent[],
  start: Date,
  end: Date,
) {
  const hourCounts = new Map<
    number,
    number
  >()

  for (const event of events) {
    const date = parseEventDate(event)

    if (
      !date ||
      date < start ||
      date >= end
    ) {
      continue
    }

    const hour = date.getHours()

    hourCounts.set(
      hour,
      (hourCounts.get(hour) ?? 0) + 1,
    )
  }

  let bestHour: number | null = null
  let bestCount = 0

  for (const [hour, count] of hourCounts) {
    if (count > bestCount) {
      bestHour = hour
      bestCount = count
    }
  }

  return bestHour
}

function countByType(
  events: UserEvent[],
): EventTypeCount[] {
  const counts = new Map<
    UserEvent["type"],
    number
  >()

  for (const event of events) {
    counts.set(
      event.type,
      (counts.get(event.type) ?? 0) + 1,
    )
  }

  return [...counts.entries()]
    .map(([type, total]) => ({
      type,
      total,
    }))
    .sort(
      (first, second) =>
        second.total - first.total,
    )
}

export function calculateAnalytics(
  events: UserEvent[],
  periodDays = 7,
): AnalyticsSummary {
  const safePeriodDays = Math.max(
    1,
    Math.round(periodDays),
  )

  const today = startOfLocalDay(new Date())

  const currentPeriodStart =
    new Date(today)

  currentPeriodStart.setDate(
    currentPeriodStart.getDate() -
      (safePeriodDays - 1),
  )

  const currentPeriodEnd =
    new Date(today)

  currentPeriodEnd.setDate(
    currentPeriodEnd.getDate() + 1,
  )

  const previousPeriodStart =
    new Date(currentPeriodStart)

  previousPeriodStart.setDate(
    previousPeriodStart.getDate() -
      safePeriodDays,
  )

  const activityCurrentPeriod =
    countEventsBetween(
      events,
      currentPeriodStart,
      currentPeriodEnd,
    )

  const previousPeriodActivity =
    countEventsBetween(
      events,
      previousPeriodStart,
      currentPeriodStart,
    )

  const periodChangePercentage =
    previousPeriodActivity > 0
      ? Math.round(
          ((activityCurrentPeriod -
            previousPeriodActivity) /
            previousPeriodActivity) *
            100,
        )
      : activityCurrentPeriod > 0
        ? 100
        : null

  const eventsInCurrentPeriod =
    events.filter((event) => {
      const date = parseEventDate(event)

      return (
        date !== null &&
        date >= currentPeriodStart &&
        date < currentPeriodEnd
      )
    })

  const dailyActivity =
    buildDailyActivity(
      eventsInCurrentPeriod,
      safePeriodDays,
    )

  return {
    periodDays: safePeriodDays,
    totalEvents: events.length,
    currentStreak:
      calculateCurrentStreak(events),
    activityCurrentPeriod,
    previousPeriodActivity,
    periodChangePercentage,
    averageDailyActivity:
      Number(
        (
          activityCurrentPeriod /
          safePeriodDays
        ).toFixed(1),
      ),
    mostActiveDay:
      findMostActiveDay(dailyActivity),
    mostActiveHour:
      findMostActiveHour(
        events,
        currentPeriodStart,
        currentPeriodEnd,
      ),
    completedTasks:
      eventsInCurrentPeriod.filter(
        (event) =>
          event.type ===
          "task-completed",
      ).length,
    createdNotes:
      eventsInCurrentPeriod.filter(
        (event) =>
          event.type ===
          "note-created",
      ).length,
    uploadedFiles:
      eventsInCurrentPeriod.filter(
        (event) =>
          event.type ===
          "file-uploaded",
      ).length,
    passedCourses:
      eventsInCurrentPeriod.filter(
        (event) =>
          event.type ===
          "course-passed",
      ).length,
    dailyActivity,
    eventsByType:
      countByType(eventsInCurrentPeriod),
  }
}
