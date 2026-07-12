import { CheckCircle2 } from "lucide-react"

import { TaskForm } from "@/components/tasks/task-form"
import { TaskList } from "@/components/tasks/task-list"

function App() {
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5 sm:px-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CheckCircle2 className="size-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold">FlujoTareas</h1>
            <p className="text-sm text-muted-foreground">
              Organiza tu trabajo de forma sencilla
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6">
        <section>
          <h2 className="text-3xl font-bold tracking-tight">
            Mis tareas
          </h2>

          <p className="mt-2 text-muted-foreground">
            Agrega, completa y administra tus actividades.
          </p>
        </section>

        <TaskForm />
        <TaskList />
      </main>
    </div>
  )
}

export default App
