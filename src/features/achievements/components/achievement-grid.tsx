import { AchievementCard } from "@/features/achievements/components/achievement-card"
import type {
  AchievementProgress,
} from "@/features/achievements/types/achievement"

interface AchievementGridProps {
  achievements: AchievementProgress[]
}

export function AchievementGrid({
  achievements,
}: AchievementGridProps) {
  const orderedAchievements = [
    ...achievements,
  ].sort((first, second) => {
    if (
      first.unlocked !== second.unlocked
    ) {
      return first.unlocked ? -1 : 1
    }

    return (
      second.percentage -
      first.percentage
    )
  })

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {orderedAchievements.map(
        (achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
          />
        ),
      )}
    </div>
  )
}
