import { useState } from "react"
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Home,
  ListTodo,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react"
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router"
import { toast } from "sonner"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/auth-provider"

interface NavigationItem {
  label: string
  path: string
  icon: typeof Home
  end?: boolean
}

const navigationItems: NavigationItem[] = [
  {
    label: "Inicio",
    path: "/",
    icon: Home,
    end: true,
  },
  {
    label: "Mis tareas",
    path: "/tareas",
    icon: ListTodo,
  },
  {
    label: "Calendario",
    path: "/calendario",
    icon: CalendarDays,
  },
  {
    label: "Estadísticas",
    path: "/estadisticas",
    icon: BarChart3,
  },
  {
    label: "Mi perfil",
    path: "/perfil",
    icon: UserRound,
  },
]

function getLinkClassName(isActive: boolean) {
  return [
    "flex items-center gap-3 rounded-xl px-3 py-2.5",
    "text-sm font-medium transition-colors",
    isActive
      ? "bg-primary text-primary-foreground shadow-sm"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  ].join(" ")
}

interface NavigationProps {
  onNavigate?: () => void
}

function Navigation({
  onNavigate,
}: NavigationProps) {
  return (
    <nav className="grid gap-1">
      {navigationItems.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              getLinkClassName(isActive)
            }
          >
            <Icon className="size-5 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)
  const [loggingOut, setLoggingOut] =
    useState(false)

  async function handleLogout() {
    try {
      setLoggingOut(true)
      setMobileMenuOpen(false)

      await logout()

      toast.success("Sesión cerrada correctamente")
      navigate("/acceso", {
        replace: true,
      })
    } catch (error) {
      console.error(error)
      toast.error("No fue posible cerrar la sesión")
    } finally {
      setLoggingOut(false)
    }
  }

  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Usuario"

  const initials = displayName
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b px-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CheckCircle2 className="size-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-lg font-bold">
              FlujoTareas
            </p>

            <p className="truncate text-xs text-muted-foreground">
              Productividad personal
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <Navigation />
        </div>

        <div className="border-t p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-muted/60 p-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {displayName}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            disabled={loggingOut}
            onClick={() => void handleLogout()}
          >
            <LogOut className="size-4" />

            {loggingOut
              ? "Cerrando..."
              : "Cerrar sesión"}
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() =>
                  setMobileMenuOpen(true)
                }
                aria-label="Abrir menú"
              >
                <Menu className="size-5" />
              </Button>

              <div className="min-w-0 lg:hidden">
                <p className="truncate font-bold">
                  FlujoTareas
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {displayName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden max-w-56 truncate text-sm text-muted-foreground md:block">
                {user?.email}
              </span>

              <ModeToggle />
            </div>
          </div>
        </header>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/55"
            aria-label="Cerrar menú"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />

          <aside className="absolute inset-y-0 left-0 flex w-[85%] max-w-80 flex-col border-r bg-background shadow-2xl">
            <div className="flex h-20 items-center justify-between border-b px-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <CheckCircle2 className="size-5" />
                </div>

                <div>
                  <p className="font-bold">
                    FlujoTareas
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Menú principal
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                aria-label="Cerrar menú"
              >
                <X className="size-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <Navigation
                onNavigate={() =>
                  setMobileMenuOpen(false)
                }
              />
            </div>

            <div className="border-t p-4">
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-muted/60 p-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {initials}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {displayName}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                disabled={loggingOut}
                onClick={() =>
                  void handleLogout()
                }
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
