import type {
  EventType,
} from "@/features/events"

export type AnalyticsRange =
  | "7-days"
  | "30-days"
  | "90-days"

export const analyticsRangeDays: Record<
  AnalyticsRange,
  number
> = {
  "7-days": 7,
  "30-days": 30,
  "90-days": 90,
}

export interface DailyActivity {
  date: string
  label: string
  total: number
}

export interface EventTypeCount {
  type: EventType
  total: number
}

export interface AnalyticsSummary {
  periodDays: number
  totalEvents: number
  currentStreak: number
  activityCurrentPeriod: number
  previousPeriodActivity: number
  periodChangePercentage: number | null
  averageDailyActivity: number
  mostActiveDay: string | null
  mostActiveHour: number | null
  completedTasks: number
  createdNotes: number
  uploadedFiles: number
  passedCourses: number
  dailyActivity: DailyActivity[]
  eventsByType: EventTypeCount[]
}
