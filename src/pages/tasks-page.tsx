import { ListTodo } from "lucide-react"

import { ExportMenu } from "@/components/dashboard/export-menu"
import { TaskFilters } from "@/components/dashboard/task-filters"
import { TaskList } from "@/components/tasks/task-list"

export function TasksPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <ListTodo className="size-4" />
            Administración
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Mis tareas
          </h1>

          <p className="mt-2 text-muted-foreground">
            Busca, filtra, edita, comenta y organiza
            tus actividades.
          </p>
        </div>

        <ExportMenu />
      </section>

      <TaskFilters />
      <TaskList />
    </div>
  )
}
