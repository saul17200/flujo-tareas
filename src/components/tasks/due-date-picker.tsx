import { es } from "date-fns/locale"
import { CalendarDays, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DueDatePickerProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function DueDatePicker({
  value,
  onChange,
}: DueDatePickerProps) {
  return (
    <div className="flex min-w-0 gap-2">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="min-w-0 flex-1 justify-start font-normal"
            />
          }
        >
          <CalendarDays className="size-4 shrink-0" />

          <span className="truncate">
            {value ? formatDate(value) : "Fecha límite"}
          </span>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-auto p-0"
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            locale={es}
          />
        </PopoverContent>
      </Popover>

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onChange(undefined)}
          aria-label="Quitar fecha límite"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  )
}
