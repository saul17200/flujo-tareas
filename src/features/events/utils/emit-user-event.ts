import { eventBus } from "@/features/events/bus/event-bus"
import type {
  EventBusPayload,
} from "@/features/events/types/event"

export function emitUserEvent(
  payload: EventBusPayload,
) {
  void eventBus.emit(payload)
}
