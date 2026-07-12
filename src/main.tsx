import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App"
import "./index.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      defaultTheme="system"
      storageKey="flujo-tareas-theme"
    >
      <App />
      <Toaster
        position="bottom-right"
        richColors
        closeButton
      />
    </ThemeProvider>
  </StrictMode>,
)
