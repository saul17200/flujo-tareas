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
    <div className="overflow-x-auto pb-2">
      <div
        className="flex h-56 items-end gap-2"
        style={{
          minWidth: `${Math.max(
            560,
            data.length * 34,
          )}px`,
        }}
      >
        {data.map((day) => {
          const percentage =
            day.total > 0
              ? Math.max(
                  7,
                  Math.round(
                    (day.total / maximum) *
                      100,
                  ),
                )
              : 0

          return (
            <div
              key={day.date}
              className="flex min-w-7 flex-1 flex-col items-center gap-2"
            >
              <span className="text-xs font-medium">
                {day.total}
              </span>

              <div className="flex h-36 w-full items-end overflow-hidden rounded-md bg-muted">
                <div
                  className="w-full rounded-md bg-primary transition-all duration-500"
                  style={{
                    height: `${percentage}%`,
                  }}
                  title={`${day.label}: ${day.total} acciones`}
                />
              </div>

              <span
                className="max-w-14 truncate text-xs capitalize text-muted-foreground"
                title={day.label}
              >
                {day.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
