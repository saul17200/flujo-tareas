import {
  CheckCircle2,
  FileText,
  Flame,
  GraduationCap,
  LockKeyhole,
  NotebookPen,
  Sparkles,
  Trophy,
} from "lucide-react"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import type {
  AchievementProgress,
} from "@/features/achievements/types/achievement"

const rarityLabels = {
  common: "Común",
  uncommon: "Poco común",
  rare: "Raro",
  epic: "Épico",
  legendary: "Legendario",
}

function getAchievementIcon(
  achievement: AchievementProgress,
) {
  switch (achievement.category) {
    case "tasks":
      return CheckCircle2

    case "notes":
      return NotebookPen

    case "files":
      return FileText

    case "academic":
      return GraduationCap

    case "streak":
      return Flame

    case "productivity":
      return Sparkles

    default:
      return Trophy
  }
}

export function AchievementCard({
  achievement,
}: {
  achievement: AchievementProgress
}) {
  const Icon = getAchievementIcon(
    achievement,
  )

  return (
    <Card
      className={[
        "relative overflow-hidden transition-transform",
        achievement.unlocked
          ? "hover:-translate-y-1"
          : "opacity-75",
      ].join(" ")}
    >
      <CardContent className="grid gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className={[
              "flex size-12 shrink-0 items-center justify-center rounded-2xl",
              achievement.unlocked
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            {achievement.unlocked ? (
              <Icon className="size-6" />
            ) : (
              <LockKeyhole className="size-5" />
            )}
          </div>

          <div className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {rarityLabels[achievement.rarity]}
          </div>
        </div>

        <div>
          <h3 className="font-semibold">
            {achievement.title}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {achievement.description}
          </p>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {achievement.progress} / {achievement.goal}
            </span>

            <span className="font-medium">
              +{achievement.xp} XP
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{
                width: `${achievement.percentage}%`,
              }}
            />
          </div>
        </div>

        {achievement.unlocked && (
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <CheckCircle2 className="size-4" />
            Desbloqueado
          </div>
        )}
      </CardContent>
    </Card>
  )
}
