import {
  CheckCircle2,
  LoaderCircle,
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
  DailyMissionCard,
} from "@/features/missions/components/daily-mission-card"
import {
  useDailyMissions,
} from "@/features/missions/hooks/use-daily-missions"

export function DailyMissionsPanel() {
  const {
    profile,
    loading,
    error,
  } = useDailyMissions()

  if (loading) {
    return (
      <Card>
        <CardContent className="flex min-h-52 items-center justify-center">
          <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="font-medium">
            No fue posible cargar las misiones
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-5" />
              Misiones de hoy
            </CardTitle>

            <CardDescription>
              Completa acciones diarias y gana XP.
            </CardDescription>
          </div>

          <div className="rounded-xl border px-3 py-2 text-sm">
            <span className="font-bold">
              {profile.completedCount}
            </span>
            {" / "}
            {profile.totalCount}
            {" · "}
            <span className="font-bold text-primary">
              {profile.earnedXp} XP
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-3">
        {profile.missions.map(
          (mission) => (
            <DailyMissionCard
              key={mission.id}
              mission={mission}
            />
          ),
        )}

        {profile.completedCount ===
          profile.totalCount && (
          <div className="rounded-2xl border bg-primary/5 p-5 text-center">
            <CheckCircle2 className="mx-auto size-8 text-primary" />

            <p className="mt-2 font-semibold">
              ¡Misiones completadas!
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Has terminado todos los retos de hoy.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
