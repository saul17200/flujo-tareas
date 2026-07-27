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

export type Reward =
  | AchievementReward
  | LevelReward
