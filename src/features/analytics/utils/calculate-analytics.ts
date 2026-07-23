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
  days = 7,
): DailyActivity[] {
  const formatter =
    new Intl.DateTimeFormat("es-MX", {
      weekday: "short",
    })

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

      const total = events.filter(
        (event) => {
          const eventDate =
            parseEventDate(event)

          return (
            eventDate !== null &&
            getDateKey(eventDate) ===
              dateKey
          )
        },
      ).length

      return {
        date: dateKey,
        label: formatter
          .format(date)
          .replace(".", ""),
        total,
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
) {
  const hourCounts = new Map<
    number,
    number
  >()

  for (const event of events) {
    const date = parseEventDate(event)

    if (!date) {
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
): AnalyticsSummary {
  const today = startOfLocalDay(new Date())

  const currentPeriodStart =
    new Date(today)

  currentPeriodStart.setDate(
    currentPeriodStart.getDate() - 6,
  )

  const currentPeriodEnd =
    new Date(today)

  currentPeriodEnd.setDate(
    currentPeriodEnd.getDate() + 1,
  )

  const previousPeriodStart =
    new Date(currentPeriodStart)

  previousPeriodStart.setDate(
    previousPeriodStart.getDate() - 7,
  )

  const activityLastSevenDays =
    countEventsBetween(
      events,
      currentPeriodStart,
      currentPeriodEnd,
    )

  const previousSevenDays =
    countEventsBetween(
      events,
      previousPeriodStart,
      currentPeriodStart,
    )

  const weeklyChangePercentage =
    previousSevenDays > 0
      ? Math.round(
          ((activityLastSevenDays -
            previousSevenDays) /
            previousSevenDays) *
            100,
        )
      : activityLastSevenDays > 0
        ? 100
        : null

  const dailyActivity =
    buildDailyActivity(events)

  return {
    totalEvents: events.length,
    currentStreak:
      calculateCurrentStreak(events),
    activityLastSevenDays,
    previousSevenDays,
    weeklyChangePercentage,
    averageDailyActivity:
      Number(
        (
          activityLastSevenDays / 7
        ).toFixed(1),
      ),
    mostActiveDay:
      findMostActiveDay(dailyActivity),
    mostActiveHour:
      findMostActiveHour(events),
    completedTasks: events.filter(
      (event) =>
        event.type ===
        "task-completed",
    ).length,
    createdNotes: events.filter(
      (event) =>
        event.type === "note-created",
    ).length,
    uploadedFiles: events.filter(
      (event) =>
        event.type === "file-uploaded",
    ).length,
    passedCourses: events.filter(
      (event) =>
        event.type === "course-passed",
    ).length,
    dailyActivity,
    eventsByType:
      countByType(events),
  }
}
