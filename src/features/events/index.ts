export {
  emitFileUploadedEvent,
  emitFileUpdatedEvent,
  emitFileDeletedEvent,
} from "@/features/events/helpers/file-events"

export {
  emitNoteCreatedEvent,
  emitNoteUpdatedEvent,
  emitNoteDeletedEvent,
} from "@/features/events/helpers/note-events"

export {
  eventBus,
} from "@/features/events/bus/event-bus"

export {
  emitUserEvent,
} from "@/features/events/utils/emit-user-event"

export {
  registerEvent,
  observeEvents,
} from "@/features/events/services/events"

export {
  useEvents,
} from "@/features/events/hooks/use-events"

export type {
  EventBusPayload,
  EventType,
  RegisterEventInput,
  UserEvent,
} from "@/features/events/types/event"
