import {
  CheckCircle2,
  Circle,
  Star,
} from "lucide-react"

import type {
  DailyMission,
} from "@/features/missions/types/mission"

export function DailyMissionCard({
  mission,
}: {
  mission: DailyMission
}) {
  return (
    <article
      className={[
        "grid gap-3 rounded-2xl border p-4",
        mission.completed
          ? "bg-primary/5"
          : "bg-background",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            mission.completed
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {mission.completed ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold">
            {mission.title}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {mission.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 text-sm font-bold text-primary">
          <Star className="size-4" />
          {mission.xp}
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {mission.progress} /{" "}
            {mission.goal}
          </span>

          <span className="font-medium">
            {mission.percentage}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{
              width:
                `${mission.percentage}%`,
            }}
          />
        </div>
      </div>
    </article>
  )
}
