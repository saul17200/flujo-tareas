import type {
  UserEvent,
} from "@/features/events"
import type {
  StreakDay,
  StreakProfile,
} from "@/features/streaks/types/streak"

const validActivityTypes =
  new Set<UserEvent["type"]>([
    "task-created",
    "task-completed",
    "note-created",
    "file-uploaded",
    "course-passed",
    "grade-updated",
    "plan-imported",
    "study-session-completed",
    "daily-mission-completed",
  ])

function startOfDay(date: Date) {
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

function getActivityCounts(
  events: UserEvent[],
) {
  const counts = new Map<string, number>()

  for (const event of events) {
    if (!validActivityTypes.has(event.type)) {
      continue
    }

    const date = new Date(event.createdAt)

    if (Number.isNaN(date.getTime())) {
      continue
    }

    const key = getDateKey(date)

    counts.set(
      key,
      (counts.get(key) ?? 0) + 1,
    )
  }

  return counts
}

function calculateCurrentStreak(
  counts: Map<string, number>,
  goal: number,
) {
  const today = startOfDay(new Date())
  const yesterday = new Date(today)

  yesterday.setDate(
    yesterday.getDate() - 1,
  )

  let cursor =
    (counts.get(getDateKey(today)) ?? 0) >= goal
      ? today
      : (counts.get(getDateKey(yesterday)) ?? 0) >= goal
        ? yesterday
        : null

  if (!cursor) {
    return 0
  }

  let streak = 0

  while (
    (counts.get(getDateKey(cursor)) ?? 0) >= goal
  ) {
    streak += 1

    cursor = new Date(cursor)
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function calculateLongestStreak(
  counts: Map<string, number>,
  goal: number,
) {
  const completedKeys = [...counts.entries()]
    .filter(([, total]) => total >= goal)
    .map(([key]) => key)
    .sort()

  if (completedKeys.length === 0) {
    return 0
  }

  let longest = 1
  let current = 1

  for (
    let index = 1;
    index < completedKeys.length;
    index += 1
  ) {
    const previous = new Date(
      `${completedKeys[index - 1]}T12:00:00`,
    )

    const actual = new Date(
      `${completedKeys[index]}T12:00:00`,
    )

    const difference = Math.round(
      (actual.getTime() -
        previous.getTime()) /
        (24 * 60 * 60 * 1000),
    )

    if (difference === 1) {
      current += 1
      longest = Math.max(longest, current)
    } else {
      current = 1
    }
  }

  return longest
}

function buildLastSevenDays(
  counts: Map<string, number>,
  goal: number,
): StreakDay[] {
  const today = startOfDay(new Date())

  const formatter =
    new Intl.DateTimeFormat("es-MX", {
      weekday: "short",
    })

  return Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(today)

      date.setDate(
        today.getDate() - (6 - index),
      )

      const dateKey = getDateKey(date)
      const activity =
        counts.get(dateKey) ?? 0

      return {
        dateKey,
        label: formatter
          .format(date)
          .replace(".", ""),
        activity,
        goal,
        completed: activity >= goal,
        today: index === 6,
      }
    },
  )
}

export function calculateStreakProfile(
  events: UserEvent[],
  dailyGoal = 3,
): StreakProfile {
  const safeGoal = Math.max(
    1,
    Math.round(dailyGoal),
  )

  const counts =
    getActivityCounts(events)

  const todayKey =
    getDateKey(new Date())

  const todayActivity =
    counts.get(todayKey) ?? 0

  const completedDays =
    [...counts.values()].filter(
      (total) => total >= safeGoal,
    ).length

  return {
    dailyGoal: safeGoal,
    todayActivity,
    todayPercentage: Math.min(
      100,
      Math.round(
        (todayActivity / safeGoal) * 100,
      ),
    ),
    todayCompleted:
      todayActivity >= safeGoal,
    currentStreak:
      calculateCurrentStreak(
        counts,
        safeGoal,
      ),
    longestStreak:
      calculateLongestStreak(
        counts,
        safeGoal,
      ),
    completedDays,
    lastSevenDays:
      buildLastSevenDays(
        counts,
        safeGoal,
      ),
  }
}
