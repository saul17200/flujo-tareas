import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App"
import "./index.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/features/auth/auth-provider"
import { TaskSync } from "@/features/auth/task-sync"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      defaultTheme="system"
      storageKey="flujo-tareas-theme"
    >
      <AuthProvider>
        <TaskSync />
        <App />

        <Toaster
          position="bottom-right"
          richColors
          closeButton
        />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
