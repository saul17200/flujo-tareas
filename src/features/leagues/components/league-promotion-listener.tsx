import {
  useEffect,
  useState,
} from "react"

import {
  useAuth,
} from "@/features/auth/auth-provider"
import {
  emitLeaguePromotedEvent,
} from "@/features/events"
import {
  leagueDefinitions,
} from "@/features/leagues/data/leagues"
import {
  useLeague,
} from "@/features/leagues/hooks/use-league"
import {
  readStoredLeague,
  writeStoredLeague,
} from "@/features/leagues/services/league-storage"
import {
  RewardCelebration,
} from "@/features/rewards"
import type {
  LeagueReward,
} from "@/features/rewards/types/reward"

function getLeagueIndex(
  leagueId: string,
) {
  return leagueDefinitions.findIndex(
    (league) => league.id === leagueId,
  )
}

export function LeaguePromotionListener() {
  const { user } = useAuth()

  const {
    profile,
    loading,
    error,
  } = useLeague()

  const [reward, setReward] =
    useState<LeagueReward | null>(null)

  useEffect(() => {
    if (
      !user ||
      loading ||
      error
    ) {
      return
    }

    const stored =
      readStoredLeague(user.uid)

    if (
      !stored ||
      stored.weekStart !==
        profile.weekStart
    ) {
      writeStoredLeague(user.uid, {
        initialized: true,
        leagueId: profile.league.id,
        weekStart: profile.weekStart,
      })

      return
    }

    const previousIndex =
      getLeagueIndex(stored.leagueId)

    const currentIndex =
      getLeagueIndex(profile.league.id)

    if (currentIndex <= previousIndex) {
      return
    }

    const promotionReward: LeagueReward = {
      id:
        `league-${profile.weekStart}-${profile.league.id}`,
      kind: "league-promoted",
      leagueId: profile.league.id,
      leagueName: profile.league.name,
      weeklyXp: profile.weeklyXp,
    }

    writeStoredLeague(user.uid, {
      initialized: true,
      leagueId: profile.league.id,
      weekStart: profile.weekStart,
    })

    emitLeaguePromotedEvent({
      userId: user.uid,
      leagueId: profile.league.id,
      leagueName: profile.league.name,
      weeklyXp: profile.weeklyXp,
    })

    setReward(promotionReward)
  }, [
    error,
    loading,
    profile,
    user,
  ])

  if (!reward) {
    return null
  }

  return (
    <RewardCelebration
      reward={reward}
      onClose={() => setReward(null)}
    />
  )
}
