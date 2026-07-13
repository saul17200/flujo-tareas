import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router"

import { ProtectedRoute } from "@/features/auth/protected-route"
import { AuthPage } from "@/pages/auth-page"
import { DashboardPage } from "@/pages/dashboard-page"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/acceso" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
