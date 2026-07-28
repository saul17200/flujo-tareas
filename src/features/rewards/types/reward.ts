import type {
  LeagueId,
} from "@/features/leagues/types/league"

export interface AchievementReward {
  id: string
  kind: "achievement"
  title: string
  description: string
  xp: number
}

export interface LevelReward {
  id: string
  kind: "level-up"
  level: number
}

export interface LeagueReward {
  id: string
  kind: "league-promoted"
  leagueId: LeagueId
  leagueName: string
  weeklyXp: number
}

export type Reward =
  | AchievementReward
  | LevelReward
  | LeagueReward
