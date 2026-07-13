import { useEffect } from "react"
import { toast } from "sonner"

import { useAuth } from "@/features/auth/auth-provider"
import { observeTasks } from "@/services/tasks"
import { useTaskStore } from "@/store/task-store"

export function TaskSync() {
  const { user } = useAuth()

  const setUserId = useTaskStore(
    (state) => state.setUserId,
  )
  const setTasks = useTaskStore(
    (state) => state.setTasks,
  )
  const setLoadingTasks = useTaskStore(
    (state) => state.setLoadingTasks,
  )
  const resetTasks = useTaskStore(
    (state) => state.resetTasks,
  )

  useEffect(() => {
    if (!user) {
      resetTasks()
      return
    }

    setUserId(user.uid)
    setLoadingTasks(true)

    const unsubscribe = observeTasks(
      user.uid,
      setTasks,
      (error) => {
        console.error(error)
        setLoadingTasks(false)
        toast.error(
          "No fue posible sincronizar las tareas.",
        )
      },
    )

    return unsubscribe
  }, [
    user,
    resetTasks,
    setLoadingTasks,
    setTasks,
    setUserId,
  ])

  return null
}
