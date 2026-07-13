import {
  useEffect,
  useState,
} from "react"
import {
  MessageCircle,
  Send,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/features/auth/auth-provider"
import {
  createTaskComment,
  observeTaskComments,
  removeTaskComment,
} from "@/services/comments"
import type { TaskComment } from "@/types/comment"
import type { Task } from "@/types/task"

interface TaskCommentsProps {
  task: Task
}

function formatCommentDate(date: string) {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return "Ahora"
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate)
}

export function TaskComments({
  task,
}: TaskCommentsProps) {
  const { user } = useAuth()

  const [comments, setComments] = useState<TaskComment[]>(
    [],
  )
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      setComments([])
      setLoading(false)
      return
    }

    setLoading(true)

    const unsubscribe = observeTaskComments(
      user.uid,
      task.id,
      (nextComments) => {
        setComments(nextComments)
        setLoading(false)
      },
      (error) => {
        console.error(
          "Error al cargar comentarios:",
          error,
        )

        setLoading(false)

        toast.error(
          "No fue posible cargar los comentarios.",
        )
      },
    )

    return unsubscribe
  }, [task.id, user])

  async function handleSubmit() {
    if (!user || submitting) {
      return
    }

    const cleanContent = content.trim()

    if (!cleanContent) {
      toast.error("Escribe un comentario.")
      return
    }

    try {
      setSubmitting(true)

      await createTaskComment(user.uid, {
        taskId: task.id,
        userId: user.uid,
        userEmail: user.email ?? "",
        userName:
          user.displayName ??
          user.email?.split("@")[0] ??
          "Usuario",
        content: cleanContent,
      })

      setContent("")
      toast.success("Comentario agregado.")
    } catch (error) {
      console.error(
        "Error al crear comentario:",
        error,
      )

      toast.error(
        "No fue posible agregar el comentario.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(commentId: string) {
    if (!user) {
      return
    }

    try {
      await removeTaskComment(
        user.uid,
        task.id,
        commentId,
      )

      toast.success("Comentario eliminado.")
    } catch (error) {
      console.error(
        "Error al eliminar comentario:",
        error,
      )

      toast.error(
        "No fue posible eliminar el comentario.",
      )
    }
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="size-4" />

        <h3 className="font-semibold">
          Comentarios
        </h3>

        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
          {comments.length}
        </span>
      </div>

      <Separator />

      <ScrollArea className="h-64 pr-3">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Cargando comentarios...
          </div>
        ) : comments.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <MessageCircle className="mb-3 size-8 text-muted-foreground" />

            <p className="font-medium">
              No hay comentarios
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Escribe el primero para esta tarea.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-xl border bg-muted/30 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {comment.userName}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {formatCommentDate(
                        comment.createdAt,
                      )}
                    </p>
                  </div>

                  {comment.userId === user?.uid && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        void handleDelete(comment.id)
                      }
                      aria-label="Eliminar comentario"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>

                <p className="mt-3 whitespace-pre-wrap break-words text-sm">
                  {comment.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="grid gap-3">
        <Textarea
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          placeholder="Escribe un comentario..."
          rows={3}
          maxLength={500}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              (event.metaKey || event.ctrlKey)
            ) {
              event.preventDefault()
              void handleSubmit()
            }
          }}
        />

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {content.length}/500
          </span>

          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting}
          >
            <Send className="size-4" />

            {submitting
              ? "Enviando..."
              : "Comentar"}
          </Button>
        </div>
      </div>
    </section>
  )
}
