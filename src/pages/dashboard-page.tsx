import { useState } from "react"
import {
  CheckCircle2,
  LogOut,
  Sparkles,
  UserRound,
} from "lucide-react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { TaskCharts } from "@/components/dashboard/task-charts"
import { TaskCalendar } from "@/components/dashboard/task-calendar"
import { TaskFilters } from "@/components/dashboard/task-filters"
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines"
import { ModeToggle } from "@/components/mode-toggle"
import { TaskForm } from "@/components/tasks/task-form"
import { TaskList } from "@/components/tasks/task-list"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/auth-provider"

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    try {
      setLoggingOut(true)
      await logout()

      toast.success("Sesión cerrada correctamente")
      navigate("/acceso", { replace: true })
    } catch {
      toast.error("No fue posible cerrar la sesión")
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <CheckCircle2 className="size-5" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold">
                FlujoTareas
              </h1>

              <p className="hidden text-sm text-muted-foreground sm:block">
                Tu espacio personal de productividad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden max-w-56 truncate text-sm text-muted-foreground md:block">
              {user?.email}
            </span>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => navigate("/perfil")}
              aria-label="Abrir perfil"
              title="Mi perfil"
            >
              <UserRound className="size-4" />
            </Button>

            <ModeToggle />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="size-4" />
              Panel de productividad
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Dashboard
            </h2>

            <p className="mt-2 text-muted-foreground">
              Administra tus actividades y revisa tu progreso.
            </p>
          </div>
        </section>

        <DashboardOverview />

        <TaskCharts />

        <UpcomingDeadlines />


        <section className="grid gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Calendario
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Consulta tus actividades por fecha.
            </p>
          </div>

          <TaskCalendar />
        </section>

        <section className="grid gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Nueva tarea
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Organiza una nueva actividad.
            </p>
          </div>

          <TaskForm />
        </section>

        <section className="grid gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Mis tareas
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Busca, filtra, edita y organiza tus actividades.
            </p>
          </div>

          <TaskFilters />
          <TaskList />
        </section>
      </main>
    </div>
  )
}
