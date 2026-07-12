import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

export type Theme = "dark" | "light" | "system"

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => undefined,
})

function getStoredTheme(
  storageKey: string,
  defaultTheme: Theme,
): Theme {
  const storedTheme = localStorage.getItem(storageKey)

  if (
    storedTheme === "light" ||
    storedTheme === "dark" ||
    storedTheme === "system"
  ) {
    return storedTheme
  }

  return defaultTheme
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "flujo-tareas-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() =>
    getStoredTheme(storageKey, defaultTheme),
  )

  useEffect(() => {
    const root = document.documentElement

    function applyTheme() {
      root.classList.remove("light", "dark")

      const resolvedTheme =
        theme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : theme

      root.classList.add(resolvedTheme)
    }

    applyTheme()

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    )

    if (theme !== "system") {
      return
    }

    mediaQuery.addEventListener("change", applyTheme)

    return () => {
      mediaQuery.removeEventListener("change", applyTheme)
    }
  }, [theme])

  function setTheme(newTheme: Theme) {
    localStorage.setItem(storageKey, newTheme)
    setThemeState(newTheme)
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeProviderContext)
}
