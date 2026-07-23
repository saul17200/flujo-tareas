import type {
  EventType,
} from "@/features/events"

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
  totalEvents: number
  currentStreak: number
  activityLastSevenDays: number
  previousSevenDays: number
  weeklyChangePercentage: number | null
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
