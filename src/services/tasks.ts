import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  writeBatch,
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { Task } from "@/types/task"

function tasksCollection(userId: string) {
  return collection(db, "users", userId, "tasks")
}

function taskDocument(userId: string, taskId: string) {
  return doc(db, "users", userId, "tasks", taskId)
}

export function observeTasks(
  userId: string,
  onTasks: (tasks: Task[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    tasksCollection(userId),
    (snapshot) => {
      const tasks: Task[] = snapshot.docs.map(
        (taskDocumentSnapshot) => {
          const data = taskDocumentSnapshot.data()

          return {
            id: taskDocumentSnapshot.id,
            title: String(data.title ?? ""),
            description: String(data.description ?? ""),
            subjectId:
              typeof data.subjectId === "string"
                ? data.subjectId
                : null,
            subjectName:
              typeof data.subjectName === "string"
                ? data.subjectName
                : null,
            priority: data.priority ?? "medium",
            status: data.status ?? "pending",
            createdAt: String(
              data.createdAt ?? new Date().toISOString(),
            ),
            dueDate:
              typeof data.dueDate === "string"
                ? data.dueDate
                : null,
            order:
              typeof data.order === "number"
                ? data.order
                : undefined,
          } as Task
        },
      )

      tasks.sort((a, b) => {
        const orderA = a.order ?? 0
        const orderB = b.order ?? 0

        if (orderA !== orderB) {
          return orderA - orderB
        }

        return b.createdAt.localeCompare(a.createdAt)
      })

      onTasks(tasks)
    },
    onError,
  )
}

export async function saveTask(
  userId: string,
  task: Task,
) {
  await setDoc(taskDocument(userId, task.id), task)
}

export async function removeTask(
  userId: string,
  taskId: string,
) {
  await deleteDoc(taskDocument(userId, taskId))
}

export async function saveTaskOrder(
  userId: string,
  tasks: Task[],
) {
  const batch = writeBatch(db)

  tasks.forEach((task, index) => {
    batch.set(
      taskDocument(userId, task.id),
      {
        ...task,
        order: index,
      },
    )
  })

  await batch.commit()
}
