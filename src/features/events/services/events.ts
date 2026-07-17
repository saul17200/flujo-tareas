import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore"

import type {
  RegisterEventInput,
  UserEvent,
} from "@/features/events/types/event"
import { db } from "@/lib/firebase"

export async function registerEvent(
  userId: string,
  event: RegisterEventInput,
) {
  const reference = await addDoc(
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

  return reference.id
}

export function observeEvents(
  userId: string,
  onSuccess: (events: UserEvent[]) => void,
  onError: (error: Error) => void,
  maximumResults = 50,
) {
  return onSnapshot(
    query(
      collection(
        db,
        "users",
        userId,
        "events",
      ),
      orderBy("createdAt", "desc"),
      limit(maximumResults),
    ),
    (snapshot) => {
      const events: UserEvent[] =
        snapshot.docs.map((snapshotDocument) => {
          const data =
            snapshotDocument.data()

          return {
            id: snapshotDocument.id,
            type: data.type,
            title: String(data.title ?? ""),
            description:
              typeof data.description === "string"
                ? data.description
                : undefined,
            createdAt: String(
              data.createdAt ??
                new Date().toISOString(),
            ),
            metadata:
              data.metadata &&
              typeof data.metadata === "object"
                ? data.metadata
                : undefined,
          } as UserEvent
        })

      onSuccess(events)
    },
    onError,
  )
}
