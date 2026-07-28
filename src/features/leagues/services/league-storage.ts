import type {
  LeagueId,
} from "@/features/leagues/types/league"

const STORAGE_PREFIX =
  "drif-notion-known-league"

interface StoredLeagueState {
  initialized: boolean
  leagueId: LeagueId
  weekStart: string
}

function getStorageKey(userId: string) {
  return `${STORAGE_PREFIX}-${userId}`
}

export function readStoredLeague(
  userId: string,
): StoredLeagueState | null {
  try {
    const raw = localStorage.getItem(
      getStorageKey(userId),
    )

    if (!raw) {
      return null
    }

    const parsed =
      JSON.parse(raw) as Partial<
        StoredLeagueState
      >

    if (
      parsed.initialized !== true ||
      typeof parsed.leagueId !== "string" ||
      typeof parsed.weekStart !== "string"
    ) {
      return null
    }

    return {
      initialized: true,
      leagueId: parsed.leagueId as LeagueId,
      weekStart: parsed.weekStart,
    }
  } catch {
    return null
  }
}

export function writeStoredLeague(
  userId: string,
  state: StoredLeagueState,
) {
  localStorage.setItem(
    getStorageKey(userId),
    JSON.stringify(state),
  )
}
