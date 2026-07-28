import {
  Flame,
  Star,
  Trophy,
} from "lucide-react"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import type {
  AchievementProfile,
} from "@/features/achievements/types/achievement"

interface AchievementLevelCardProps {
  profile: AchievementProfile
  streak: number
}

export function AchievementLevelCard({
  profile,
  streak,
}: AchievementLevelCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="grid gap-6 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Trophy className="size-8" />
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Nivel actual
              </p>

              <p className="text-4xl font-bold">
                {profile.level}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border bg-background px-4 py-3">
              <Star className="size-5 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">
                  XP total
                </p>

                <p className="font-bold">
                  {profile.totalXp}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border bg-background px-4 py-3">
              <Flame className="size-5 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Racha
                </p>

                <p className="font-bold">
                  {streak} días
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">
                XP por logros
              </p>

              <p className="mt-1 font-bold">
                {profile.achievementXp} XP
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                XP por misiones
              </p>

              <p className="mt-1 font-bold">
                {profile.bonusXp} XP
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Progreso al nivel {profile.level + 1}
            </span>

            <span className="text-muted-foreground">
              {profile.currentLevelXp} / {profile.nextLevelXp} XP
            </span>
          </div>

          <div
            className="h-4 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Progreso de nivel"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={profile.levelProgress}
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{
                width: `${profile.levelProgress}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
