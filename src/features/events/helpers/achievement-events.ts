import { emitUserEvent } from "@/features/events/utils/emit-user-event"

interface AchievementUnlockedContext {
  userId: string
  achievementId: string
  title: string
  xp: number
}

export function emitAchievementUnlockedEvent({
  userId,
  achievementId,
  title,
  xp,
}: AchievementUnlockedContext) {
  emitUserEvent({
    userId,
    type: "achievement-unlocked",
    title: `Desbloqueaste el logro: ${title}`,
    description: `Recompensa: +${xp} XP`,
    metadata: {
      achievementId,
      xp,
    },
  })
}

interface LevelUpContext {
  userId: string
  level: number
}

export function emitLevelUpEvent({
  userId,
  level,
}: LevelUpContext) {
  emitUserEvent({
    userId,
    type: "level-up",
    title: `¡Subiste al nivel ${level}!`,
    description:
      "Tu constancia académica sigue creciendo.",
    metadata: {
      level,
    },
  })
}
