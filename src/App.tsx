import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router"

import { AppLayout } from "@/components/layout/app-layout"
import { ProtectedRoute } from "@/features/auth/protected-route"
import { AuthPage } from "@/pages/auth-page"
import { CalendarPage } from "@/pages/calendar-page"
import { DashboardPage } from "@/pages/dashboard-page"
import { ProfilePage } from "@/pages/profile-page"
import { StatisticsPage } from "@/pages/statistics-page"
import { TasksPage } from "@/pages/tasks-page"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/acceso"
          element={<AuthPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              index
              element={<DashboardPage />}
            />

            <Route
              path="tareas"
              element={<TasksPage />}
            />

            <Route
              path="calendario"
              element={<CalendarPage />}
            />

            <Route
              path="estadisticas"
              element={<StatisticsPage />}
            />
          </Route>

          <Route
            path="perfil"
            element={<ProfilePage />}
          />
        </Route>

        <Route
          path="*"
          element={<AuthPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
