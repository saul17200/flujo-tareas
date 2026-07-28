import {
  leagueDefinitions,
} from "@/features/leagues/data/leagues"
import type {
  LeagueProfile,
} from "@/features/leagues/types/league"

function getWeekStart(date: Date) {
  const result = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  )

  const day = result.getDay()
  const difference =
    day === 0 ? -6 : 1 - day

  result.setDate(
    result.getDate() + difference,
  )

  return result
}

function getWeekEnd(weekStart: Date) {
  const result = new Date(weekStart)

  result.setDate(
    result.getDate() + 6,
  )

  result.setHours(
    23,
    59,
    59,
    999,
  )

  return result
}

function getDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0")
  const day = String(
    date.getDate(),
  ).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function calculateLeagueProfile(
  weeklyXp: number,
  date = new Date(),
): LeagueProfile {
  const safeWeeklyXp = Math.max(
    0,
    Math.round(weeklyXp),
  )

  const league =
    [...leagueDefinitions]
      .reverse()
      .find(
        (item) =>
          safeWeeklyXp >=
          item.minimumWeeklyXp,
      ) ?? leagueDefinitions[0]

  const leagueIndex =
    leagueDefinitions.findIndex(
      (item) => item.id === league.id,
    )

  const nextLeague =
    leagueDefinitions[
      leagueIndex + 1
    ] ?? null

  const currentMinimum =
    league.minimumWeeklyXp

  const nextMinimum =
    nextLeague?.minimumWeeklyXp ??
    currentMinimum

  const progressRange =
    Math.max(
      1,
      nextMinimum - currentMinimum,
    )

  const progressValue =
    safeWeeklyXp - currentMinimum

  const weekStart =
    getWeekStart(date)

  const weekEnd =
    getWeekEnd(weekStart)

  return {
    league,
    nextLeague,
    weeklyXp: safeWeeklyXp,
    xpToNextLeague:
      nextLeague
        ? Math.max(
            0,
            nextLeague.minimumWeeklyXp -
              safeWeeklyXp,
          )
        : 0,
    progressPercentage:
      nextLeague
        ? Math.min(
            100,
            Math.round(
              (progressValue /
                progressRange) *
                100,
            ),
          )
        : 100,
    weekStart:
      getDateKey(weekStart),
    weekEnd:
      getDateKey(weekEnd),
  }
}
