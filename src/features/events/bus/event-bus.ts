import { registerEvent } from "@/features/events/services/events"
import type {
  EventBusPayload,
  EventType,
} from "@/features/events/types/event"

type EventBusListener = (
  payload: EventBusPayload,
) => void | Promise<void>

const listeners = new Map<
  EventType | "*",
  Set<EventBusListener>
>()

function getListeners(
  type: EventType | "*",
) {
  const current = listeners.get(type)

  if (current) {
    return current
  }

  const created =
    new Set<EventBusListener>()

  listeners.set(type, created)

  return created
}

async function persistEvent(
  payload: EventBusPayload,
) {
  const {
    userId,
    ...event
  } = payload

  await registerEvent(userId, event)
}

getListeners("*").add(persistEvent)

export const eventBus = {
  async emit(
    payload: EventBusPayload,
  ) {
    const eventListeners = [
      ...getListeners(payload.type),
      ...getListeners("*"),
    ]

    const uniqueListeners = [
      ...new Set(eventListeners),
    ]

    const results =
      await Promise.allSettled(
        uniqueListeners.map((listener) =>
          listener(payload),
        ),
      )

    const failedResult =
      results.find(
        (result) =>
          result.status === "rejected",
      )

    if (
      failedResult &&
      failedResult.status === "rejected"
    ) {
      console.error(
        "[EventBus] No fue posible procesar el evento:",
        failedResult.reason,
      )
    }
  },

  on(
    type: EventType | "*",
    listener: EventBusListener,
  ) {
    const typeListeners =
      getListeners(type)

    typeListeners.add(listener)

    return () => {
      typeListeners.delete(listener)
    }
  },
}
