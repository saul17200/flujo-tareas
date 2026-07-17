import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore"

import { db } from "@/lib/firebase"

import type {
  EventType,
  UserEvent,
} from "@/features/events/types/event"

interface RegisterEventInput {
  type: EventType

  title: string

  description?: string

  metadata?: Record<string, unknown>
}

export async function registerEvent(
  userId: string,
  event: RegisterEventInput,
) {
  await addDoc(
    collection(
      db,
      "users",
      userId,
      "events",
    ),
    {
      ...event,
      createdAt: new Date().toISOString(),
    },
  )
}

export function observeEvents(
  userId: string,
  onSuccess: (
    events: UserEvent[],
  ) => void,
  onError: (
    error: Error,
  ) => void,
) {
  return onSnapshot(
    query(
      collection(
        db,
        "users",
        userId,
        "events",
      ),
      orderBy(
        "createdAt",
        "desc",
      ),
      limit(50),
    ),

    (snapshot) => {
      onSuccess(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<
            UserEvent,
            "id"
          >),
        })),
      )
    },

    onError,
  )
}
