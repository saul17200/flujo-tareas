import type { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
      {children}
    </main>
  )
}
