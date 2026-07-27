import {
  LoaderCircle,
  Trophy,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AchievementGrid } from "@/features/achievements/components/achievement-grid"
import { AchievementLevelCard } from "@/features/achievements/components/achievement-level-card"
import { useAchievements } from "@/features/achievements/hooks/use-achievements"

export function AchievementProfile() {
  const {
    profile,
    loading,
    error,
  } = useAchievements()

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
    console.error(error)

    return (
      <Card>
        <CardContent className="p-8">
          <p className="font-bold text-destructive">
            Error al cargar logros
          </p>

          <pre className="mt-4 overflow-auto rounded-lg bg-muted p-4 text-xs">
            {String(error)}
          </pre>
        </CardContent>
      </Card>
    )
  }

  const streakAchievement =
    profile.achievements.find(
      (achievement) =>
        achievement.metric ===
        "currentStreak",
    )

  const streak =
    streakAchievement?.progress ?? 0

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-medium text-primary">
          Progreso académico
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Logros y nivel
        </h1>

        <p className="mt-2 text-muted-foreground">
          Gana XP al completar tareas, crear apuntes,
          subir archivos y avanzar en tu carrera.
        </p>
      </div>

      <AchievementLevelCard
        profile={profile}
        streak={streak}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="size-5" />
            Colección de logros
          </CardTitle>

          <CardDescription>
            {profile.unlockedCount} de{" "}
            {profile.totalCount} logros desbloqueados.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-6 grid gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Progreso total
              </span>

              <span className="text-muted-foreground">
                {profile.unlockedCount} / {profile.totalCount}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{
                  width: `${
                    profile.totalCount > 0
                      ? Math.round(
                          (profile.unlockedCount /
                            profile.totalCount) *
                            100,
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <AchievementGrid
            achievements={
              profile.achievements
            }
          />
        </CardContent>
      </Card>
    </section>
  )
}
