import {
  Flame,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react"
import { Link } from "react-router"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAchievements } from "@/features/achievements/hooks/use-achievements"

export function DashboardAchievementCard() {
  const {
    profile,
    loading,
    error,
  } = useAchievements()

  if (loading) {
    return (
      <Card>
        <CardContent className="flex min-h-48 items-center justify-center">
          <div className="size-7 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="font-medium">
            No fue posible cargar tu progreso
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Revisa el acceso a tus eventos.
          </p>
        </CardContent>
      </Card>
    )
  }

  const unlockedAchievements =
    profile.achievements.filter(
      (achievement) =>
        achievement.unlocked,
    )

  const lastUnlocked =
    unlockedAchievements[
      unlockedAchievements.length - 1
    ] ?? null

  const nextAchievement =
    profile.achievements
      .filter(
        (achievement) =>
          !achievement.unlocked,
      )
      .sort(
        (first, second) =>
          second.percentage -
          first.percentage,
      )[0] ?? null

  const streak =
    profile.achievements.find(
      (achievement) =>
        achievement.metric ===
        "currentStreak",
    )?.progress ?? 0

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-5" />
              Tu progreso
            </CardTitle>

            <CardDescription>
              Nivel, XP, racha y próximo logro.
            </CardDescription>
          </div>

          <Link
            to="/logros"
            className="inline-flex h-8 w-fit items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Ver logros
          </Link>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <ProgressMetric
            icon={Trophy}
            value={`Nivel ${profile.level}`}
            label="Nivel actual"
          />

          <ProgressMetric
            icon={Star}
            value={`${profile.totalXp} XP`}
            label="Experiencia total"
          />

          <ProgressMetric
            icon={Flame}
            value={`${streak} días`}
            label="Racha actual"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-medium">
              Siguiente nivel
            </span>

            <span className="text-muted-foreground">
              {profile.currentLevelXp} /{" "}
              {profile.nextLevelXp} XP
            </span>
          </div>

          <div
            className="h-4 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Progreso al siguiente nivel"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              profile.levelProgress
            }
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{
                width:
                  `${profile.levelProgress}%`,
              }}
            />
          </div>
        </div>

        {nextAchievement ? (
          <div className="rounded-2xl border bg-muted/20 p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Próximo logro
                </p>

                <p className="mt-1 font-semibold">
                  {nextAchievement.title}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {nextAchievement.description}
                </p>

                <div className="mt-3 grid gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>
                      {nextAchievement.progress} /{" "}
                      {nextAchievement.goal}
                    </span>

                    <span className="font-medium text-primary">
                      +{nextAchievement.xp} XP
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{
                        width:
                          `${nextAchievement.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border bg-primary/5 p-4 text-center">
            <Trophy className="mx-auto size-8 text-primary" />

            <p className="mt-2 font-semibold">
              ¡Colección completada!
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Has desbloqueado todos los logros disponibles.
            </p>
          </div>
        )}

        {lastUnlocked && (
          <p className="text-sm text-muted-foreground">
            Último logro disponible:{" "}
            <span className="font-medium text-foreground">
              {lastUnlocked.title}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface ProgressMetricProps {
  icon: typeof Trophy
  value: string
  label: string
}

function ProgressMetric({
  icon: Icon,
  value,
  label,
}: ProgressMetricProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-background p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
