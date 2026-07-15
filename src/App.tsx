import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router"

import { AppLayout } from "@/components/layout/app-layout"
import { ProtectedRoute } from "@/features/auth/protected-route"
import { AuthPage } from "@/pages/auth-page"
import { CalendarPage } from "@/pages/calendar-page"
import { CareerPage } from "@/pages/career-page"
import { DashboardPage } from "@/pages/dashboard-page"
import { ProfilePage } from "@/pages/profile-page"
import { SchedulePage } from "@/pages/schedule-page"
import { StatisticsPage } from "@/pages/statistics-page"
import { SubjectPage } from "@/pages/subject-page"
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
              path="horario"
              element={<SchedulePage />}
            />

            <Route
              path="calendario"
              element={<CalendarPage />}
            />

            <Route
              path="carrera"
              element={<CareerPage />}
            />

            <Route
              path="carrera/:planId/materia/:courseId"
              element={<SubjectPage />}
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
