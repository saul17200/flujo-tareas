export type AchievementCategory =
  | "tasks"
  | "notes"
  | "files"
  | "academic"
  | "streak"
  | "productivity"

export type AchievementRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"

export type AchievementMetric =
  | "completedTasks"
  | "createdNotes"
  | "uploadedFiles"
  | "passedCourses"
  | "currentStreak"
  | "totalEvents"

export interface AchievementDefinition {
  id: string
  title: string
  description: string
  category: AchievementCategory
  rarity: AchievementRarity
  metric: AchievementMetric
  goal: number
  xp: number
}

export interface AchievementProgress
  extends AchievementDefinition {
  progress: number
  percentage: number
  unlocked: boolean
}

export interface AchievementProfile {
  totalXp: number
  achievementXp: number
  bonusXp: number
  level: number
  currentLevelXp: number
  nextLevelXp: number
  levelProgress: number
  unlockedCount: number
  totalCount: number
  achievements: AchievementProgress[]
}
