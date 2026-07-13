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
      const tasks = snapshot.docs.map((taskDoc) => ({
        id: taskDoc.id,
        ...taskDoc.data(),
      })) as Task[]

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
