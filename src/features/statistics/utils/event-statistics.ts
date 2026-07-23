import type {
  EventType,
  UserEvent,
} from "@/features/events"

export interface EventStatistics {
  completedTasks: number
  createdNotes: number
  uploadedFiles: number
  passedCourses: number
  activityLastSevenDays: number
  currentStreak: number
}

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

function countEvents(
  events: UserEvent[],
  type: EventType,
) {
  return events.filter(
    (event) => event.type === type,
  ).length
}

function calculateCurrentStreak(
  events: UserEvent[],
) {
  const activeDays = new Set<string>()

  for (const event of events) {
    const date = new Date(event.createdAt)

    if (!Number.isNaN(date.getTime())) {
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

  let cursor = activeDays.has(
    getDateKey(today),
  )
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

export function calculateEventStatistics(
  events: UserEvent[],
): EventStatistics {
  const sevenDaysAgo =
    startOfLocalDay(new Date())

  sevenDaysAgo.setDate(
    sevenDaysAgo.getDate() - 6,
  )

  const activityLastSevenDays =
    events.filter((event) => {
      const date = new Date(event.createdAt)

      return (
        !Number.isNaN(date.getTime()) &&
        date >= sevenDaysAgo
      )
    }).length

  return {
    completedTasks: countEvents(
      events,
      "task-completed",
    ),
    createdNotes: countEvents(
      events,
      "note-created",
    ),
    uploadedFiles: countEvents(
      events,
      "file-uploaded",
    ),
    passedCourses: countEvents(
      events,
      "course-passed",
    ),
    activityLastSevenDays,
    currentStreak:
      calculateCurrentStreak(events),
  }
}
