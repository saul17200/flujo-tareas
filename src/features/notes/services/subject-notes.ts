import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore"

import type {
  SubjectNote,
  SubjectNoteInput,
} from "@/features/notes/types/subject-note"
import { db } from "@/lib/firebase"

function notesCollection(
  userId: string,
  planId: string,
  courseId: string,
) {
  return collection(
    db,
    "users",
    userId,
    "academicPlans",
    planId,
    "courses",
    courseId,
    "notes",
  )
}

function noteDocument(
  userId: string,
  planId: string,
  courseId: string,
  noteId: string,
) {
  return doc(
    db,
    "users",
    userId,
    "academicPlans",
    planId,
    "courses",
    courseId,
    "notes",
    noteId,
  )
}

export function observeSubjectNotes(
  userId: string,
  planId: string,
  courseId: string,
  onNotes: (notes: SubjectNote[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    notesCollection(userId, planId, courseId),
    (snapshot) => {
      const notes: SubjectNote[] = snapshot.docs
        .map((noteSnapshot) => {
          const data = noteSnapshot.data()

          return {
            id: noteSnapshot.id,
            title: String(data.title ?? ""),
            content: String(data.content ?? ""),
            createdAt: String(
              data.createdAt ??
                new Date().toISOString(),
            ),
            updatedAt: String(
              data.updatedAt ??
                data.createdAt ??
                new Date().toISOString(),
            ),
          }
        })
        .sort((first, second) =>
          second.updatedAt.localeCompare(
            first.updatedAt,
          ),
        )

      onNotes(notes)
    },
    onError,
  )
}

export async function createSubjectNote(
  userId: string,
  planId: string,
  courseId: string,
  input: SubjectNoteInput,
): Promise<string> {
  const title = input.title.trim()
  const content = input.content.trim()

  if (!title) {
    throw new Error(
      "La nota necesita un título.",
    )
  }

  const now = new Date().toISOString()

  const reference = await addDoc(
    notesCollection(
      userId,
      planId,
      courseId,
    ),
    {
      title,
      content,
      createdAt: now,
      updatedAt: now,
    },
  )

  return reference.id
}

export async function updateSubjectNote(
  userId: string,
  planId: string,
  courseId: string,
  noteId: string,
  input: SubjectNoteInput,
): Promise<void> {
  const title = input.title.trim()
  const content = input.content.trim()

  if (!title) {
    throw new Error(
      "La nota necesita un título.",
    )
  }

  await updateDoc(
    noteDocument(
      userId,
      planId,
      courseId,
      noteId,
    ),
    {
      title,
      content,
      updatedAt: new Date().toISOString(),
    },
  )
}

export async function removeSubjectNote(
  userId: string,
  planId: string,
  courseId: string,
  noteId: string,
): Promise<void> {
  await deleteDoc(
    noteDocument(
      userId,
      planId,
      courseId,
      noteId,
    ),
  )
}
