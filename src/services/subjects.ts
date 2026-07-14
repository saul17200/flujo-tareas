import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type {
  CreateSubjectInput,
  Subject,
} from "@/types/subject"

function subjectsCollection(userId: string) {
  return collection(
    db,
    "users",
    userId,
    "subjects",
  )
}

export function observeSubjects(
  userId: string,
  onSubjects: (subjects: Subject[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    subjectsCollection(userId),
    (snapshot) => {
      const subjects: Subject[] = snapshot.docs
        .map((subjectDocument) => {
          const data = subjectDocument.data()

          return {
            id: subjectDocument.id,
            name: String(data.name ?? ""),
            professor: String(data.professor ?? ""),
            classroom: String(data.classroom ?? ""),
            period: String(data.period ?? ""),
            color: String(data.color ?? "#14b8a6"),
            days: Array.isArray(data.days)
              ? data.days
              : [],
            startTime: String(data.startTime ?? ""),
            endTime: String(data.endTime ?? ""),
            createdAt: String(
              data.createdAt ??
                new Date().toISOString(),
            ),
          } as Subject
        })
        .sort((a, b) =>
          a.name.localeCompare(b.name, "es"),
        )

      onSubjects(subjects)
    },
    onError,
  )
}

export async function createSubject(
  userId: string,
  input: CreateSubjectInput,
) {
  await addDoc(subjectsCollection(userId), {
    ...input,
    name: input.name.trim(),
    professor: input.professor.trim(),
    classroom: input.classroom.trim(),
    period: input.period.trim(),
    createdAt: new Date().toISOString(),
  })
}

export async function updateSubject(
  userId: string,
  subjectId: string,
  input: Partial<CreateSubjectInput>,
) {
  await updateDoc(
    doc(
      db,
      "users",
      userId,
      "subjects",
      subjectId,
    ),
    input,
  )
}

export async function removeSubject(
  userId: string,
  subjectId: string,
) {
  await deleteDoc(
    doc(
      db,
      "users",
      userId,
      "subjects",
      subjectId,
    ),
  )
}
