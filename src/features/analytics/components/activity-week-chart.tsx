import type {
  DailyActivity,
} from "@/features/analytics/types/analytics"

interface ActivityWeekChartProps {
  data: DailyActivity[]
}

export function ActivityWeekChart({
  data,
}: ActivityWeekChartProps) {
  const maximum = Math.max(
    1,
    ...data.map((day) => day.total),
  )

  return (
    <div className="grid gap-4">
      <div className="flex h-52 items-end gap-2 sm:gap-4">
        {data.map((day) => {
          const percentage =
            day.total > 0
              ? Math.max(
                  8,
                  Math.round(
                    (day.total / maximum) *
                      100,
                  ),
                )
              : 0

          return (
            <div
              key={day.date}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <span className="text-xs font-medium">
                {day.total}
              </span>

              <div className="flex h-36 w-full items-end overflow-hidden rounded-lg bg-muted">
                <div
                  className="w-full rounded-lg bg-primary transition-all duration-500"
                  style={{
                    height: `${percentage}%`,
                  }}
                  title={`${day.total} acciones`}
                />
              </div>

              <span className="truncate text-xs capitalize text-muted-foreground">
                {day.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
