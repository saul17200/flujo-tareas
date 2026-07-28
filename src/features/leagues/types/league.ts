export type LeagueId =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master"
  | "legend"

export interface LeagueDefinition {
  id: LeagueId
  name: string
  minimumWeeklyXp: number
  description: string
}

export interface LeagueProfile {
  league: LeagueDefinition
  nextLeague: LeagueDefinition | null
  weeklyXp: number
  xpToNextLeague: number
  progressPercentage: number
  weekStart: string
  weekEnd: string
}
