const STORAGE_PREFIX =
  "drif-notion-daily-mission-rewards"

interface MissionRewardState {
  dateKey: string
  rewardedMissionIds: string[]
}

function getStorageKey(userId: string) {
  return `${STORAGE_PREFIX}-${userId}`
}

export function readMissionRewardState(
  userId: string,
  dateKey: string,
): MissionRewardState {
  try {
    const raw = localStorage.getItem(
      getStorageKey(userId),
    )

    if (!raw) {
      return {
        dateKey,
        rewardedMissionIds: [],
      }
    }

    const parsed = JSON.parse(raw) as Partial<
      MissionRewardState
    >

    if (parsed.dateKey !== dateKey) {
      return {
        dateKey,
        rewardedMissionIds: [],
      }
    }

    return {
      dateKey,
      rewardedMissionIds:
        Array.isArray(
          parsed.rewardedMissionIds,
        )
          ? parsed.rewardedMissionIds.filter(
              (item): item is string =>
                typeof item === "string",
            )
          : [],
    }
  } catch {
    return {
      dateKey,
      rewardedMissionIds: [],
    }
  }
}

export function writeMissionRewardState(
  userId: string,
  state: MissionRewardState,
) {
  localStorage.setItem(
    getStorageKey(userId),
    JSON.stringify(state),
  )
}
