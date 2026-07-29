import {
  Bot,
  CalendarDays,
  CheckCircle2,
  Flame,
  ListTodo,
  Sparkles,
  Target,
} from "lucide-react"
import { Link } from "react-router"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CopilotCard,
} from "@/features/copilot/components/copilot-card"
import {
  WeeklyCopilotCard,
} from "@/features/copilot/components/weekly-copilot-card"
import {
  useCopilot,
} from "@/features/copilot/hooks/use-copilot"
import {
  useDailyMissions,
} from "@/features/missions"
import {
  useSmartStreak,
} from "@/features/streaks"
import {
  useTaskStore,
} from "@/store/task-store"

export function CopilotOverview() {
  const {
    summary,
    loading,
    error,
  } = useCopilot()

  const {
    profile: missions,
  } = useDailyMissions()

  const {
    streak,
  } = useSmartStreak(3)

  const tasks = useTaskStore(
    (state) => state.tasks,
  )

  const pendingTasks = tasks.filter(
    (task) =>
      task.status !== "completed",
  ).length

  const completedMissions =
    missions.completedCount

  if (loading) {
    return <CopilotCard />
  }

  if (error) {
    return <CopilotCard />
  }

  return (
    <section className="grid gap-6">
      <div>
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <Bot className="size-4" />
          Copiloto de productividad
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {summary.greeting}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Tu resumen diario se genera con tus
          tareas, metas, misiones y progreso.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryMetric
          icon={ListTodo}
          value={String(pendingTasks)}
          label="Tareas pendientes"
        />

        <SummaryMetric
          icon={Flame}
          value={String(
            streak.currentStreak,
          )}
          label="Días de racha"
        />

        <SummaryMetric
          icon={Target}
          value={`${completedMissions}/${missions.totalCount}`}
          label="Misiones de hoy"
        />

        <SummaryMetric
          icon={CheckCircle2}
          value={`${streak.todayActivity}/${streak.dailyGoal}`}
          label="Meta diaria"
        />
      </div>

      <CopilotCard />

      <WeeklyCopilotCard />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-5" />
            Plan sugerido para hoy
          </CardTitle>

          <CardDescription>
            Sigue estos pasos en el orden
            recomendado por Drif Notion.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-3">
          {summary.recommendations.map(
            (recommendation, index) => (
              <article
                key={recommendation.id}
                className="flex gap-4 rounded-2xl border p-4"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {recommendation.title}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {recommendation.description}
                  </p>

                  {recommendation.destination && (
                    <Link
                      to={
                        recommendation.destination
                      }
                      className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
                    >
                      Ir a la acción
                    </Link>
                  )}
                </div>
              </article>
            ),
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-7 text-center">
          <Sparkles className="size-9 text-primary" />

          <div>
            <p className="font-semibold">
              Avanza un paso a la vez
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Completar primero la recomendación
              principal facilitará el resto de tu día.
            </p>
          </div>
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
  icon: typeof Bot
  value: string
  label: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>

        <div className="min-w-0">
          <p className="text-2xl font-bold">
            {value}
          </p>

          <p className="text-sm text-muted-foreground">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
