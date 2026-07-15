import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  ListTodo,
  Sparkles,
} from "lucide-react"
import { Link } from "react-router"

import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines"
import { TaskForm } from "@/components/tasks/task-form"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { useAuth } from "@/features/auth/auth-provider"

const quickLinks = [
  {
    title: "Mis tareas",
    description:
      "Busca, filtra, edita y organiza tus actividades.",
    path: "/tareas",
    icon: ListTodo,
  },
  {
    title: "Calendario",
    description:
      "Consulta todas tus fechas y vencimientos.",
    path: "/calendario",
    icon: CalendarDays,
  },
  {
    title: "Estadísticas",
    description:
      "Analiza tu progreso y productividad.",
    path: "/estadisticas",
    icon: BarChart3,
  },
]

export function DashboardPage() {
  const { user } = useAuth()

  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Usuario"

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="size-4" />
          Panel principal
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Hola, {displayName}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Revisa tu progreso y organiza lo más
          importante del día.
        </p>
      </section>

      <DashboardOverview />

      <section className="grid gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Agregar tarea
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Registra rápidamente una nueva actividad.
          </p>
        </div>

        <TaskForm />
      </section>

      <UpcomingDeadlines />

      <section className="grid gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Accesos rápidos
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Abre las demás herramientas de Drif Notion.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon

            return (
              <Card
                key={item.path}
                className="transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <CardContent className="grid gap-4 p-5">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  <Link
                    to={item.path}
                    className="inline-flex h-8 w-fit items-center justify-center gap-1.5 rounded-lg px-0 text-sm font-medium text-primary transition-colors hover:underline"
                  >
                    Abrir sección
                    <ArrowRight className="size-4" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
