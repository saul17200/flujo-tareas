import {
  CalendarDays,
  LoaderCircle,
  Medal,
  Sparkles,
  Target,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  LeaguePath,
} from "@/features/leagues/components/league-path"
import {
  useLeague,
} from "@/features/leagues/hooks/use-league"

export function LeagueOverview() {
  const {
    profile,
    loading,
    error,
  } = useLeague()

  if (loading) {
    return (
      <Card>
        <CardContent className="flex min-h-72 items-center justify-center">
          <LoaderCircle className="size-7 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="font-medium">
            No fue posible cargar las ligas
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Revisa el acceso a los eventos de tu
            cuenta.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-medium text-primary">
          Competencia semanal
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Ligas
        </h1>

        <p className="mt-2 text-muted-foreground">
          Gana XP con logros y misiones para
          ascender de Bronce a Leyenda.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="grid gap-6 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Medal className="size-8" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Liga actual
                </p>

                <p className="text-3xl font-bold">
                  {profile.league.name}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <SummaryMetric
                icon={Sparkles}
                value={`${profile.weeklyXp} XP`}
                label="XP semanal"
              />

              <SummaryMetric
                icon={CalendarDays}
                value={profile.weekEnd}
                label="Fin de semana"
              />
            </div>
          </div>

          {profile.nextLeague ? (
            <div className="grid gap-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium">
                  Camino a Liga{" "}
                  {profile.nextLeague.name}
                </p>

                <p className="text-sm text-muted-foreground">
                  Faltan{" "}
                  {profile.xpToNextLeague} XP
                </p>
              </div>

              <div className="h-5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{
                    width:
                      `${profile.progressPercentage}%`,
                  }}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                {profile.progressPercentage}% del
                camino completado.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border bg-primary/5 p-5 text-center">
              <Sparkles className="mx-auto size-9 text-primary" />

              <p className="mt-2 font-bold">
                ¡Alcanzaste Liga Leyenda!
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Continúa ganando XP para mantener
                tu mejor rendimiento.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="size-5" />
            Camino de ligas
          </CardTitle>

          <CardDescription>
            Cada liga requiere una cantidad mayor
            de XP semanal.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LeaguePath profile={profile} />
        </CardContent>
      </Card>
    </section>
  )
}

function SummaryMetric({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Sparkles
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-background p-4">
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <div className="min-w-0">
        <p className="truncate font-bold">
          {value}
        </p>

        <p className="text-xs text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  )
}
