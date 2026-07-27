import {
  useCallback,
  useEffect,
  useState,
} from "react"

import { useAchievements } from "@/features/achievements"
import { useAuth } from "@/features/auth/auth-provider"
import {
  emitAchievementUnlockedEvent,
  emitLevelUpEvent,
} from "@/features/events"
import {
  readRewardStorage,
  writeRewardStorage,
} from "@/features/rewards/services/reward-storage"
import type {
  Reward,
} from "@/features/rewards/types/reward"

export function useRewardEngine() {
  const { user } = useAuth()

  const {
    profile,
    loading,
    error,
  } = useAchievements()

  const [queue, setQueue] =
    useState<Reward[]>([])

  const [activeReward, setActiveReward] =
    useState<Reward | null>(null)

  useEffect(() => {
    if (
      !user ||
      loading ||
      error
    ) {
      return
    }

    const unlockedAchievements =
      profile.achievements.filter(
        (achievement) =>
          achievement.unlocked,
      )

    const stored =
      readRewardStorage(user.uid)

    if (!stored?.initialized) {
      writeRewardStorage(user.uid, {
        initialized: true,
        deliveredAchievementIds:
          unlockedAchievements.map(
            (achievement) =>
              achievement.id,
          ),
        lastKnownLevel: profile.level,
      })

      return
    }

    const deliveredIds =
      new Set(
        stored.deliveredAchievementIds,
      )

    const newAchievements =
      unlockedAchievements.filter(
        (achievement) =>
          !deliveredIds.has(
            achievement.id,
          ),
      )

    const newRewards: Reward[] =
      newAchievements.map(
        (achievement) => ({
          id:
            `achievement-${achievement.id}`,
          kind: "achievement",
          title: achievement.title,
          description:
            achievement.description,
          xp: achievement.xp,
        }),
      )

    for (
      const achievement
      of newAchievements
    ) {
      deliveredIds.add(
        achievement.id,
      )

      emitAchievementUnlockedEvent({
        userId: user.uid,
        achievementId:
          achievement.id,
        title: achievement.title,
        xp: achievement.xp,
      })
    }

    if (
      profile.level >
      stored.lastKnownLevel
    ) {
      newRewards.push({
        id: `level-${profile.level}`,
        kind: "level-up",
        level: profile.level,
      })

      emitLevelUpEvent({
        userId: user.uid,
        level: profile.level,
      })
    }

    writeRewardStorage(user.uid, {
      initialized: true,
      deliveredAchievementIds: [
        ...deliveredIds,
      ],
      lastKnownLevel: profile.level,
    })

    if (newRewards.length > 0) {
      setQueue((current) => [
        ...current,
        ...newRewards,
      ])
    }
  }, [
    error,
    loading,
    profile,
    user,
  ])

  useEffect(() => {
    if (
      activeReward ||
      queue.length === 0
    ) {
      return
    }

    const [
      nextReward,
      ...remainingRewards
    ] = queue

    setActiveReward(nextReward)
    setQueue(remainingRewards)
  }, [
    activeReward,
    queue,
  ])

  const dismissReward =
    useCallback(() => {
      setActiveReward(null)
    }, [])

  useEffect(() => {
    if (!activeReward) {
      return
    }

    const timer =
      window.setTimeout(
        dismissReward,
        4500,
      )

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    activeReward,
    dismissReward,
  ])

  return {
    activeReward,
    dismissReward,
  }
}
