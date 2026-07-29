export type CopilotRecommendationKind =
  | "urgent-task"
  | "upcoming-task"
  | "streak"
  | "mission"
  | "level"
  | "league"
  | "productivity"

export type CopilotRecommendationPriority =
  | "high"
  | "medium"
  | "low"

export interface CopilotRecommendation {
  id: string
  kind: CopilotRecommendationKind
  priority: CopilotRecommendationPriority
  title: string
  description: string
  destination?: string
}

export interface CopilotSummary {
  greeting: string
  headline: string
  recommendations: CopilotRecommendation[]
  urgentCount: number
}

export type WeeklyTrend =
  | "up"
  | "down"
  | "stable"

export interface CopilotWeeklySummary {
  currentWeekActivity: number
  previousWeekActivity: number
  changePercentage: number | null
  trend: WeeklyTrend
  completedTasks: number
  earnedXp: number
  completedGoalDays: number
  mostActiveDay: string | null
  highlight: string
  risk: string | null
  recommendation: string
}
