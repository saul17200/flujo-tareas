import {
  CheckCircle2,
  Flame,
  LoaderCircle,
  Target,
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
  useSmartStreak,
} from "@/features/streaks/hooks/use-smart-streak"

export function SmartStreakCard() {
  const {
    streak,
    loading,
    error,
  } = useSmartStreak(3)

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
            No fue posible cargar tu racha
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="size-5" />
          Racha inteligente
        </CardTitle>

        <CardDescription>
          Cumple tu meta diaria con actividad real.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric
            icon={Flame}
            value={`${streak.currentStreak}`}
            label="Racha actual"
          />

          <Metric
            icon={Trophy}
            value={`${streak.longestStreak}`}
            label="Mejor racha"
          />

          <Metric
            icon={Target}
            value={`${streak.todayActivity}/${streak.dailyGoal}`}
            label="Meta de hoy"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Progreso de hoy
            </span>

            <span className="text-muted-foreground">
              {streak.todayPercentage}%
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{
                width:
                  `${streak.todayPercentage}%`,
              }}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            {streak.todayCompleted
              ? "Meta cumplida. Tu racha está protegida."
              : `Te faltan ${Math.max(
                  0,
                  streak.dailyGoal -
                    streak.todayActivity,
                )} acciones para proteger tu racha.`}
          </p>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {streak.lastSevenDays.map(
            (day) => (
              <div
                key={day.dateKey}
                className="grid justify-items-center gap-2"
              >
                <div
                  className={[
                    "flex size-9 items-center justify-center rounded-full border",
                    day.completed
                      ? "bg-primary text-primary-foreground"
                      : day.today
                        ? "border-primary bg-primary/5"
                        : "bg-muted text-muted-foreground",
                  ].join(" ")}
                  title={`${day.activity}/${day.goal} acciones`}
                >
                  {day.completed ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <span className="text-xs font-bold">
                      {day.activity}
                    </span>
                  )}
                </div>

                <span className="text-xs capitalize text-muted-foreground">
                  {day.label}
                </span>
              </div>
            ),
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Flame
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border p-4">
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <div>
        <p className="text-xl font-bold">
          {value}
        </p>

        <p className="text-xs text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  )
}
