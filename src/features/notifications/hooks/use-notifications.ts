import {
  useEffect,
  useMemo,
  useState,
} from "react"

import { useAuth } from "@/features/auth/auth-provider"
import { useEvents } from "@/features/events"
import { buildNotifications } from "@/features/notifications/utils/build-notifications"
import { useTaskStore } from "@/store/task-store"

function getStorageKey(userId: string) {
  return `drif-notion-read-notifications-${userId}`
}

function readStoredIds(userId: string) {
  try {
    const value = localStorage.getItem(
      getStorageKey(userId),
    )

    if (!value) {
      return new Set<string>()
    }

    const parsed = JSON.parse(value)

    return new Set<string>(
      Array.isArray(parsed)
        ? parsed.filter(
            (item): item is string =>
              typeof item === "string",
          )
        : [],
    )
  } catch {
    return new Set<string>()
  }
}

export function useNotifications() {
  const { user } = useAuth()
  const tasks = useTaskStore(
    (state) => state.tasks,
  )

  const {
    events,
    loading: loadingEvents,
    error,
  } = useEvents(50)

  const [readIds, setReadIds] =
    useState<Set<string>>(
      () =>
        user
          ? readStoredIds(user.uid)
          : new Set(),
    )

  useEffect(() => {
    if (!user) {
      setReadIds(new Set())
      return
    }

    setReadIds(
      readStoredIds(user.uid),
    )
  }, [user])

  function persistReadIds(
    nextIds: Set<string>,
  ) {
    setReadIds(nextIds)

    if (!user) {
      return
    }

    localStorage.setItem(
      getStorageKey(user.uid),
      JSON.stringify([...nextIds]),
    )
  }

  const notifications = useMemo(
    () =>
      buildNotifications({
        tasks,
        events,
        readIds,
      }),
    [events, readIds, tasks],
  )

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read,
    ).length

  function markAsRead(
    notificationId: string,
  ) {
    if (readIds.has(notificationId)) {
      return
    }

    const nextIds = new Set(readIds)
    nextIds.add(notificationId)

    persistReadIds(nextIds)
  }

  function markAllAsRead() {
    const nextIds = new Set(readIds)

    for (const notification of notifications) {
      nextIds.add(notification.id)
    }

    persistReadIds(nextIds)
  }

  function clearReadHistory() {
    persistReadIds(new Set())
  }

  return {
    notifications,
    unreadCount,
    loading: loadingEvents,
    error,
    markAsRead,
    markAllAsRead,
    clearReadHistory,
  }
}
