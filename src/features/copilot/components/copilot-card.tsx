import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Flame,
  ListTodo,
  LoaderCircle,
  Medal,
  Sparkles,
  Star,
  Target,
} from "lucide-react"
import {
  useNavigate,
} from "react-router"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  useCopilot,
} from "@/features/copilot/hooks/use-copilot"
import type {
  CopilotRecommendation,
} from "@/features/copilot/types/copilot"

function getRecommendationIcon(
  recommendation: CopilotRecommendation,
) {
  switch (recommendation.kind) {
    case "urgent-task":
    case "upcoming-task":
      return ListTodo

    case "streak":
      return Flame

    case "mission":
      return Target

    case "level":
      return Star

    case "league":
      return Medal

    default:
      return Sparkles
  }
}

export function CopilotCard() {
  const navigate = useNavigate()

  const {
    summary,
    loading,
    error,
  } = useCopilot()

  if (loading) {
    return (
      <Card>
        <CardContent className="flex min-h-56 items-center justify-center">
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
            No fue posible preparar tu resumen
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Bot className="size-6" />
          </div>

          <div className="min-w-0 flex-1">
            <CardTitle>
              {summary.greeting}
            </CardTitle>

            <CardDescription className="mt-1">
              {summary.headline}
            </CardDescription>
          </div>

          {summary.urgentCount > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive">
              <AlertTriangle className="size-3.5" />
              {summary.urgentCount}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="grid gap-3">
        {summary.recommendations.map(
          (recommendation) => {
            const Icon =
              getRecommendationIcon(
                recommendation,
              )

            return (
              <button
                key={recommendation.id}
                type="button"
                onClick={() => {
                  if (
                    recommendation.destination
                  ) {
                    navigate(
                      recommendation.destination,
                    )
                  }
                }}
                className={[
                  "flex w-full items-center gap-3 rounded-2xl border p-4 text-left",
                  "transition-colors hover:bg-muted",
                  recommendation.priority ===
                  "high"
                    ? "border-destructive/40 bg-destructive/5"
                    : "bg-background",
                ].join(" ")}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {recommendation.title}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {recommendation.description}
                  </p>
                </div>

                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
              </button>
            )
          },
        )}
      </CardContent>
    </Card>
  )
}
