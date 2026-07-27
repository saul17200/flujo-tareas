const REWARD_STORAGE_PREFIX =
  "drif-notion-rewards"

interface RewardStorageState {
  initialized: boolean
  deliveredAchievementIds: string[]
  lastKnownLevel: number
}

function getStorageKey(userId: string) {
  return `${REWARD_STORAGE_PREFIX}-${userId}`
}

export function readRewardStorage(
  userId: string,
): RewardStorageState | null {
  try {
    const value = localStorage.getItem(
      getStorageKey(userId),
    )

    if (!value) {
      return null
    }

    const parsed = JSON.parse(value) as Partial<
      RewardStorageState
    >

    return {
      initialized:
        parsed.initialized === true,
      deliveredAchievementIds:
        Array.isArray(
          parsed.deliveredAchievementIds,
        )
          ? parsed.deliveredAchievementIds.filter(
              (item): item is string =>
                typeof item === "string",
            )
          : [],
      lastKnownLevel:
        typeof parsed.lastKnownLevel === "number"
          ? parsed.lastKnownLevel
          : 1,
    }
  } catch {
    return null
  }
}

export function writeRewardStorage(
  userId: string,
  state: RewardStorageState,
) {
  localStorage.setItem(
    getStorageKey(userId),
    JSON.stringify(state),
  )
}
