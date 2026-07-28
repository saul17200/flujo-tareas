import {
  CheckCircle2,
  Crown,
  Gem,
  LockKeyhole,
  Medal,
  Sparkles,
  Trophy,
} from "lucide-react"

import {
  leagueDefinitions,
} from "@/features/leagues/data/leagues"
import type {
  LeagueId,
  LeagueProfile,
} from "@/features/leagues/types/league"

function getLeagueIcon(id: LeagueId) {
  switch (id) {
    case "diamond":
      return Gem

    case "master":
      return Trophy

    case "legend":
      return Crown

    case "gold":
    case "silver":
    case "bronze":
    case "platinum":
      return Medal

    default:
      return Sparkles
  }
}

export function LeaguePath({
  profile,
}: {
  profile: LeagueProfile
}) {
  const currentIndex =
    leagueDefinitions.findIndex(
      (league) =>
        league.id === profile.league.id,
    )

  return (
    <div className="grid gap-4">
      {leagueDefinitions.map(
        (league, index) => {
          const Icon =
            getLeagueIcon(league.id)

          const reached =
            index <= currentIndex

          const current =
            league.id === profile.league.id

          return (
            <article
              key={league.id}
              className={[
                "relative flex items-center gap-4 rounded-2xl border p-5",
                current
                  ? "border-primary bg-primary/5"
                  : reached
                    ? "bg-background"
                    : "bg-muted/30 opacity-70",
              ].join(" ")}
            >
              <div
                className={[
                  "flex size-14 shrink-0 items-center justify-center rounded-2xl",
                  reached
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                {reached ? (
                  <Icon className="size-7" />
                ) : (
                  <LockKeyhole className="size-6" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold">
                    Liga {league.name}
                  </h3>

                  {current && (
                    <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                      Liga actual
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {league.description}
                </p>

                <p className="mt-2 text-sm font-medium">
                  Desde{" "}
                  {league.minimumWeeklyXp} XP
                  semanales
                </p>
              </div>

              {reached && (
                <CheckCircle2 className="size-5 shrink-0 text-primary" />
              )}
            </article>
          )
        },
      )}
    </div>
  )
}
