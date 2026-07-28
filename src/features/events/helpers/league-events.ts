import {
  emitUserEvent,
} from "@/features/events/utils/emit-user-event"
import type {
  LeagueId,
} from "@/features/leagues/types/league"

interface LeaguePromotedContext {
  userId: string
  leagueId: LeagueId
  leagueName: string
  weeklyXp: number
}

export function emitLeaguePromotedEvent({
  userId,
  leagueId,
  leagueName,
  weeklyXp,
}: LeaguePromotedContext) {
  emitUserEvent({
    userId,
    type: "league-promoted",
    title: `Ascendiste a Liga ${leagueName}`,
    description:
      `Alcanzaste ${weeklyXp} XP esta semana.`,
    metadata: {
      leagueId,
      leagueName,
      weeklyXp,
    },
  })
}
