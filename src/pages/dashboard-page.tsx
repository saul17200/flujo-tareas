import { useState } from "react"
import { CheckCircle2, LogOut } from "lucide-react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import { TaskFilters } from "@/components/dashboard/task-filters"
import { TaskStats } from "@/components/dashboard/task-stats"
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
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <CheckCircle2 className="size-5" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold">
                FlujoTareas
              </h1>

              <p className="hidden text-sm text-muted-foreground sm:block">
                Organiza tu trabajo de forma sencilla
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden max-w-56 truncate text-sm text-muted-foreground md:block">
              {user?.email}
            </span>

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
        <section>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Dashboard
          </h2>

          <p className="mt-2 text-muted-foreground">
            Administra tus actividades y revisa tu progreso.
          </p>
        </section>

        <TaskStats />
        <TaskForm />
        <TaskFilters />
        <TaskList />
      </main>
    </div>
  )
}
