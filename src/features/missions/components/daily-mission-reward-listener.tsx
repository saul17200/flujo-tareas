import {
  useEffect,
} from "react"
import { toast } from "sonner"

import {
  useAuth,
} from "@/features/auth/auth-provider"
import {
  emitDailyMissionCompletedEvent,
} from "@/features/events"
import {
  useDailyMissions,
} from "@/features/missions/hooks/use-daily-missions"
import {
  readMissionRewardState,
  writeMissionRewardState,
} from "@/features/missions/services/mission-reward-storage"

export function DailyMissionRewardListener() {
  const { user } = useAuth()

  const {
    profile,
    loading,
    error,
  } = useDailyMissions()

  useEffect(() => {
    if (
      !user ||
      loading ||
      error
    ) {
      return
    }

    const state =
      readMissionRewardState(
        user.uid,
        profile.dateKey,
      )

    const rewardedIds =
      new Set(
        state.rewardedMissionIds,
      )

    const newlyCompleted =
      profile.missions.filter(
        (mission) =>
          mission.completed &&
          !rewardedIds.has(mission.id),
      )

    if (newlyCompleted.length === 0) {
      return
    }

    for (const mission of newlyCompleted) {
      rewardedIds.add(mission.id)

      emitDailyMissionCompletedEvent({
        userId: user.uid,
        missionId: mission.id,
        title: mission.title,
        xp: mission.xp,
        dateKey: profile.dateKey,
      })

      toast.success(
        `Misión completada: ${mission.title}`,
        {
          description: `+${mission.xp} XP`,
        },
      )
    }

    writeMissionRewardState(
      user.uid,
      {
        dateKey: profile.dateKey,
        rewardedMissionIds: [
          ...rewardedIds,
        ],
      },
    )
  }, [
    error,
    loading,
    profile,
    user,
  ])

  return null
}
