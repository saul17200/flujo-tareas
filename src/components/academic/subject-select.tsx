import { useEffect, useState } from "react"
import { BookOpen } from "lucide-react"
import { toast } from "sonner"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { useAuth } from "@/features/auth/auth-provider"
import { observeSubjects } from "@/services/subjects"
import type { Subject } from "@/types/subject"

interface SubjectSelectProps {
  value: string | null
  onChange: (
    subjectId: string | null,
    subjectName: string | null,
  ) => void
}

export function SubjectSelect({
  value,
  onChange,
}: SubjectSelectProps) {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])

  useEffect(() => {
    if (!user) {
      setSubjects([])
      return
    }

    return observeSubjects(
      user.uid,
      setSubjects,
      (error) => {
        console.error(error)
        toast.error("No fue posible cargar las materias.")
      },
    )
  }, [user])

  const selectedSubject = subjects.find(
    (subject) => subject.id === value,
  )

  return (
    <Select
      value={value ?? "none"}
      onValueChange={(nextValue) => {
        if (nextValue === "none") {
          onChange(null, null)
          return
        }

        const subject = subjects.find(
          (item) => item.id === nextValue,
        )

        onChange(
          subject?.id ?? null,
          subject?.name ?? null,
        )
      }}
    >
      <SelectTrigger>
        <span className="flex min-w-0 items-center gap-2">
          <BookOpen className="size-4 shrink-0" />

          <span className="truncate">
            {selectedSubject?.name ?? "Sin materia"}
          </span>
        </span>
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="none">
          Sin materia
        </SelectItem>

        {subjects.map((subject) => (
          <SelectItem
            key={subject.id}
            value={subject.id}
          >
            {subject.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
