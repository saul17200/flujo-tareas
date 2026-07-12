import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useTaskStore,
  type PriorityFilter,
  type StatusFilter,
} from "@/store/task-store"

export function TaskFilters() {
  const search = useTaskStore((state) => state.search)
  const statusFilter = useTaskStore(
    (state) => state.statusFilter,
  )
  const priorityFilter = useTaskStore(
    (state) => state.priorityFilter,
  )

  const setSearch = useTaskStore(
    (state) => state.setSearch,
  )
  const setStatusFilter = useTaskStore(
    (state) => state.setStatusFilter,
  )
  const setPriorityFilter = useTaskStore(
    (state) => state.setPriorityFilter,
  )
  const clearFilters = useTaskStore(
    (state) => state.clearFilters,
  )

  const hasFilters =
    search !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all"

  return (
    <section className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm lg:grid-cols-[1fr_190px_190px_auto]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Buscar tareas..."
          className="pl-9"
        />
      </div>

      <Select
        value={statusFilter}
        onValueChange={(value) =>
          setStatusFilter(value as StatusFilter)
        }
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            Todos los estados
          </SelectItem>
          <SelectItem value="pending">
            Pendientes
          </SelectItem>
          <SelectItem value="completed">
            Completadas
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={priorityFilter}
        onValueChange={(value) =>
          setPriorityFilter(value as PriorityFilter)
        }
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            Todas las prioridades
          </SelectItem>
          <SelectItem value="low">Baja</SelectItem>
          <SelectItem value="medium">Media</SelectItem>
          <SelectItem value="high">Alta</SelectItem>
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="outline"
        disabled={!hasFilters}
        onClick={clearFilters}
      >
        <X className="size-4" />
        Limpiar
      </Button>
    </section>
  )
}
