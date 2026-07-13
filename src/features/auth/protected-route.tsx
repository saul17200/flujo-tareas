import { Navigate, Outlet } from "react-router"

import { useAuth } from "@/features/auth/auth-provider"

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />

          <p className="mt-4 text-sm text-muted-foreground">
            Cargando sesión...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/acceso" replace />
  }

  return <Outlet />
}
