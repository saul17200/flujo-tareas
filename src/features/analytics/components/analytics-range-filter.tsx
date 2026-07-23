import type {
  AnalyticsRange,
} from "@/features/analytics/types/analytics"

interface AnalyticsRangeFilterProps {
  value: AnalyticsRange
  onChange: (range: AnalyticsRange) => void
}

const ranges: Array<{
  value: AnalyticsRange
  label: string
}> = [
  {
    value: "7-days",
    label: "7 días",
  },
  {
    value: "30-days",
    label: "30 días",
  },
  {
    value: "90-days",
    label: "90 días",
  },
]

export function AnalyticsRangeFilter({
  value,
  onChange,
}: AnalyticsRangeFilterProps) {
  return (
    <div
      className="inline-flex flex-wrap gap-1 rounded-xl border bg-background p-1"
      aria-label="Periodo de las analíticas"
    >
      {ranges.map((range) => {
        const active =
          range.value === value

        return (
          <button
            key={range.value}
            type="button"
            onClick={() =>
              onChange(range.value)
            }
            className={[
              "rounded-lg px-3 py-2 text-sm font-medium",
              "transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
          >
            {range.label}
          </button>
        )
      })}
    </div>
  )
}
