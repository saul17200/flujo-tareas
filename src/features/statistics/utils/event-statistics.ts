import type {
  EventType,
  UserEvent,
} from "@/features/events"
import {
  calculateStreakProfile,
} from "@/features/streaks/utils/calculate-streak"

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

function countEvents(
  events: UserEvent[],
  type: EventType,
) {
  return events.filter(
    (event) => event.type === type,
  ).length
}

export function calculateEventStatistics(
  events: UserEvent[],
): EventStatistics {
  const smartStreak =
    calculateStreakProfile(
      events,
      3,
    )
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
      smartStreak.currentStreak,
  }
}
