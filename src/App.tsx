import { CheckCircle2 } from "lucide-react"

import { TaskFilters } from "@/components/dashboard/task-filters"
import { TaskStats } from "@/components/dashboard/task-stats"
import { TaskForm } from "@/components/tasks/task-form"
import { TaskList } from "@/components/tasks/task-list"

function App() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CheckCircle2 className="size-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              FlujoTareas
            </h1>

            <p className="text-sm text-muted-foreground">
              Organiza tu trabajo de forma sencilla
            </p>
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

export default App
