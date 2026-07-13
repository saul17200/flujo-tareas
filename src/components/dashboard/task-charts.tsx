import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTaskStore } from "@/store/task-store"

const chartColors = {
  completed: "var(--chart-1, #2563eb)",
  pending: "var(--chart-2, #f59e0b)",
  low: "var(--chart-3, #10b981)",
  medium: "var(--chart-4, #6366f1)",
  high: "var(--chart-5, #ef4444)",
}

export function TaskCharts() {
  const tasks = useTaskStore((state) => state.tasks)

  const statusData = useMemo(() => {
    const pending = tasks.filter(
      (task) => task.status === "pending",
    ).length

    const completed = tasks.filter(
      (task) => task.status === "completed",
    ).length

    return [
      {
        name: "Pendientes",
        value: pending,
        fill: chartColors.pending,
      },
      {
        name: "Completadas",
        value: completed,
        fill: chartColors.completed,
      },
    ]
  }, [tasks])

  const priorityData = useMemo(
    () => [
      {
        name: "Baja",
        cantidad: tasks.filter(
          (task) => task.priority === "low",
        ).length,
        fill: chartColors.low,
      },
      {
        name: "Media",
        cantidad: tasks.filter(
          (task) => task.priority === "medium",
        ).length,
        fill: chartColors.medium,
      },
      {
        name: "Alta",
        cantidad: tasks.filter(
          (task) => task.priority === "high",
        ).length,
        fill: chartColors.high,
      },
    ],
    [tasks],
  )

  const hasTasks = tasks.length > 0

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Estado de las tareas</CardTitle>

          <CardDescription>
            Distribución entre pendientes y completadas.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {hasTasks ? (
            <div className="h-72 w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    stroke="transparent"
                  >
                    {statusData.map((item) => (
                      <Cell
                        key={item.name}
                        fill={item.fill}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart />
          )}

          <div className="flex flex-wrap justify-center gap-5 text-sm">
            {statusData.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2"
              >
                <span
                  className="size-3 rounded-full"
                  style={{ background: item.fill }}
                />

                <span className="text-muted-foreground">
                  {item.name}
                </span>

                <span className="font-semibold">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tareas por prioridad</CardTitle>

          <CardDescription>
            Cantidad de tareas en cada nivel.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {hasTasks ? (
            <div className="h-80 w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={priorityData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.25}
                  />

                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="cantidad"
                    radius={[8, 8, 0, 0]}
                  >
                    {priorityData.map((item) => (
                      <Cell
                        key={item.name}
                        fill={item.fill}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart />
          )}
        </CardContent>
      </Card>
    </section>
  )
}

function EmptyChart() {
  return (
    <div className="flex h-72 items-center justify-center rounded-xl border border-dashed">
      <p className="text-sm text-muted-foreground">
        Crea una tarea para visualizar estadísticas.
      </p>
    </div>
  )
}
