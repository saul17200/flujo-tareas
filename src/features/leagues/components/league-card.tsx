import {
  Crown,
  LoaderCircle,
  Medal,
  Sparkles,
  Trophy,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  useLeague,
} from "@/features/leagues/hooks/use-league"

export function LeagueCard() {
  const {
    profile,
    loading,
    error,
  } = useLeague()

  if (loading) {
    return (
      <Card>
        <CardContent className="flex min-h-48 items-center justify-center">
          <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-7 text-center">
          <p className="font-medium">
            No fue posible cargar tu liga
          </p>
        </CardContent>
      </Card>
    )
  }

  const Icon =
    profile.league.id === "legend"
      ? Crown
      : profile.league.id === "master"
        ? Trophy
        : Medal

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-5" />
          Liga {profile.league.name}
        </CardTitle>

        <CardDescription>
          {profile.league.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="flex flex-col gap-4 rounded-2xl border bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              XP semanal
            </p>

            <p className="mt-1 text-4xl font-bold">
              {profile.weeklyXp}
            </p>
          </div>

          <div className="flex size-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
            <Icon className="size-10" />
          </div>
        </div>

        {profile.nextLeague ? (
          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-medium">
                Camino a Liga{" "}
                {profile.nextLeague.name}
              </span>

              <span className="text-muted-foreground">
                Faltan{" "}
                {profile.xpToNextLeague} XP
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{
                  width:
                    `${profile.progressPercentage}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border bg-primary/5 p-5 text-center">
            <Sparkles className="mx-auto size-8 text-primary" />

            <p className="mt-2 font-semibold">
              Liga máxima alcanzada
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Ya perteneces a la Liga Leyenda.
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Semana: {profile.weekStart} al{" "}
          {profile.weekEnd}
        </p>
      </CardContent>
    </Card>
  )
}
