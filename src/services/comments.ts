import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { TaskComment } from "@/types/comment"

interface CreateCommentInput {
  taskId: string
  userId: string
  userEmail: string
  userName: string
  content: string
}

function commentsCollection(
  userId: string,
  taskId: string,
) {
  return collection(
    db,
    "users",
    userId,
    "tasks",
    taskId,
    "comments",
  )
}

export function observeTaskComments(
  userId: string,
  taskId: string,
  onComments: (comments: TaskComment[]) => void,
  onError: (error: Error) => void,
) {
  const commentsQuery = query(
    commentsCollection(userId, taskId),
    orderBy("createdAt", "asc"),
  )

  return onSnapshot(
    commentsQuery,
    (snapshot) => {
      const comments: TaskComment[] =
        snapshot.docs.map((commentDoc) => {
          const data = commentDoc.data()

          return {
            id: commentDoc.id,
            taskId,
            userId: String(data.userId ?? ""),
            userEmail: String(data.userEmail ?? ""),
            userName: String(data.userName ?? ""),
            content: String(data.content ?? ""),
            createdAt: String(
              data.createdAt ??
                new Date().toISOString(),
            ),
          }
        })

      onComments(comments)
    },
    onError,
  )
}

export async function createTaskComment(
  ownerId: string,
  input: CreateCommentInput,
) {
  const cleanContent = input.content.trim()

  if (!cleanContent) {
    throw new Error("El comentario está vacío.")
  }

  await addDoc(
    commentsCollection(ownerId, input.taskId),
    {
      ...input,
      content: cleanContent,
      createdAt: new Date().toISOString(),
    },
  )
}

export async function removeTaskComment(
  ownerId: string,
  taskId: string,
  commentId: string,
) {
  await deleteDoc(
    doc(
      db,
      "users",
      ownerId,
      "tasks",
      taskId,
      "comments",
      commentId,
    ),
  )
}
