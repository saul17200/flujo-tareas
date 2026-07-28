import { achievementDefinitions } from "@/features/achievements/data/achievements"
import type {
  AchievementMetric,
  AchievementProfile,
} from "@/features/achievements/types/achievement"

interface AchievementMetrics {
  completedTasks: number
  createdNotes: number
  uploadedFiles: number
  passedCourses: number
  currentStreak: number
  totalEvents: number
}

function getMetricValue(
  metrics: AchievementMetrics,
  metric: AchievementMetric,
) {
  return metrics[metric]
}

function getXpRequiredForLevel(
  level: number,
) {
  return 250 + (level - 1) * 150
}

function calculateLevel(totalXp: number) {
  let level = 1
  let remainingXp = Math.max(0, totalXp)

  while (
    remainingXp >=
    getXpRequiredForLevel(level)
  ) {
    remainingXp -=
      getXpRequiredForLevel(level)

    level += 1
  }

  const nextLevelXp =
    getXpRequiredForLevel(level)

  return {
    level,
    currentLevelXp: remainingXp,
    nextLevelXp,
    levelProgress: Math.min(
      100,
      Math.round(
        (remainingXp / nextLevelXp) * 100,
      ),
    ),
  }
}

export function calculateAchievementProfile(
  metrics: AchievementMetrics,
  bonusXp = 0,
): AchievementProfile {
  const achievements =
    achievementDefinitions.map(
      (achievement) => {
        const progress =
          getMetricValue(
            metrics,
            achievement.metric,
          )

        const unlocked =
          progress >= achievement.goal

        return {
          ...achievement,
          progress,
          percentage: Math.min(
            100,
            Math.round(
              (progress / achievement.goal) *
                100,
            ),
          ),
          unlocked,
        }
      },
    )

  const achievementXp = achievements
    .filter(
      (achievement) =>
        achievement.unlocked,
    )
    .reduce(
      (total, achievement) =>
        total + achievement.xp,
      0,
    )

  const safeBonusXp = Math.max(
    0,
    Math.round(bonusXp),
  )

  const totalXp =
    achievementXp + safeBonusXp

  const levelData =
    calculateLevel(totalXp)

  return {
    totalXp,
    achievementXp,
    bonusXp: safeBonusXp,
    ...levelData,
    unlockedCount:
      achievements.filter(
        (achievement) =>
          achievement.unlocked,
      ).length,
    totalCount: achievements.length,
    achievements,
  }
}
