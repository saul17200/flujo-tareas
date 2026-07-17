import {
  useEffect,
  useState,
} from "react"

import { useAuth } from "@/features/auth/auth-provider"
import { observeEvents } from "@/features/events/services/events"
import type {
  UserEvent,
} from "@/features/events/types/event"

export function useEvents(
  maximumResults = 20,
) {
  const { user } = useAuth()

  const [events, setEvents] =
    useState<UserEvent[]>([])
  const [loading, setLoading] =
    useState(true)
  const [error, setError] =
    useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setEvents([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    return observeEvents(
      user.uid,
      (nextEvents) => {
        setEvents(nextEvents)
        setLoading(false)
      },
      (nextError) => {
        console.error(
          "[Eventos] Error al leer actividad:",
          nextError,
        )

        setError(nextError)
        setLoading(false)
      },
      maximumResults,
    )
  }, [maximumResults, user])

  return {
    events,
    loading,
    error,
  }
}
