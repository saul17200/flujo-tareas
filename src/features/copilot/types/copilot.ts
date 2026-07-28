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
