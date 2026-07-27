import {
  Bell,
  BellRing,
  BookOpen,
  CheckCheck,
  CheckCircle2,
  FileText,
  GraduationCap,
  LoaderCircle,
  NotebookPen,
} from "lucide-react"
import { useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useNotifications } from "@/features/notifications/hooks/use-notifications"
import type {
  AppNotification,
} from "@/features/notifications/types/notification"

function formatRelativeDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Fecha desconocida"
  }

  const difference =
    date.getTime() - Date.now()

  const formatter =
    new Intl.RelativeTimeFormat("es-MX", {
      numeric: "auto",
    })

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (Math.abs(difference) < minute) {
    return "Ahora"
  }

  if (Math.abs(difference) < hour) {
    return formatter.format(
      Math.round(difference / minute),
      "minute",
    )
  }

  if (Math.abs(difference) < day) {
    return formatter.format(
      Math.round(difference / hour),
      "hour",
    )
  }

  return formatter.format(
    Math.round(difference / day),
    "day",
  )
}

function getNotificationIcon(
  notification: AppNotification,
) {
  switch (notification.kind) {
    case "task":
      return CheckCircle2

    case "note":
      return NotebookPen

    case "file":
      return FileText

    case "academic":
      return GraduationCap

    default:
      return BookOpen
  }
}

export function NotificationCenter() {
  const navigate = useNavigate()

  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotifications()

  function openNotification(
    notification: AppNotification,
  ) {
    markAsRead(notification.id)

    if (notification.destination) {
      navigate(notification.destination)
    }
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="relative inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-muted"
            aria-label={
              unreadCount > 0
                ? `${unreadCount} notificaciones sin leer`
                : "Notificaciones"
            }
          >
            {unreadCount > 0 ? (
              <BellRing className="size-4" />
            ) : (
              <Bell className="size-4" />
            )}

            {unreadCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>
        }
      />

      <PopoverContent
        align="end"
        className="w-[min(92vw,400px)] p-0"
      >
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <p className="font-semibold">
              Notificaciones
            </p>

            <p className="text-xs text-muted-foreground">
              {unreadCount === 1
                ? "1 sin leer"
                : `${unreadCount} sin leer`}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={unreadCount === 0}
            onClick={markAllAsRead}
          >
            <CheckCheck className="size-4" />
            Marcar todas
          </Button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-2">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="font-medium">
                No fue posible cargar las notificaciones
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Revisa el acceso a los eventos.
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="mx-auto size-9 text-muted-foreground" />

              <p className="mt-3 font-medium">
                Todo está al día
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Aquí aparecerán tareas, actividad y
                avisos académicos.
              </p>
            </div>
          ) : (
            <div className="grid gap-1">
              {notifications.map(
                (notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onOpen={() =>
                      openNotification(
                        notification,
                      )
                    }
                  />
                ),
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function NotificationItem({
  notification,
  onOpen,
}: {
  notification: AppNotification
  onOpen: () => void
}) {
  const Icon =
    getNotificationIcon(notification)

  return (
    <button
      type="button"
      onClick={onOpen}
      className={[
        "flex w-full gap-3 rounded-xl p-3 text-left",
        "transition-colors hover:bg-muted",
        notification.read
          ? "opacity-70"
          : "bg-primary/5",
      ].join(" ")}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="flex-1 break-words text-sm font-medium">
            {notification.title}
          </p>

          {!notification.read && (
            <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>

        {notification.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {notification.description}
          </p>
        )}

        <p className="mt-2 text-xs text-muted-foreground">
          {formatRelativeDate(
            notification.createdAt,
          )}
        </p>
      </div>
    </button>
  )
}
