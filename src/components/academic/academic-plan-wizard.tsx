import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  LoaderCircle,
  Plus,
  Trash2,
  Upload,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/features/auth/auth-provider"
import {
  createAcademicPlanDraftFromLayout,
} from "@/lib/curriculum-parser"
import { extractPdfLayout } from "@/lib/pdf"
import { createAcademicPlanFromDraft } from "@/services/academic-plans"
import type {
  AcademicCourseDraft,
  AcademicPlanDraft,
} from "@/types/academic-plan"

interface AcademicPlanWizardProps {
  onCreated?: (planId: string) => void
}

function createEmptyCourse(
  semester = 1,
): AcademicCourseDraft {
  return {
    temporaryId:
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random()}`,
    code: "",
    name: "",
    semester,
    credits: 0,
  }
}

export function AcademicPlanWizard({
  onCreated,
}: AcademicPlanWizardProps) {
  const { user } = useAuth()
  const fileInputReference =
    useRef<HTMLInputElement>(null)

  const [step, setStep] = useState(1)
  const [draft, setDraft] =
    useState<AcademicPlanDraft | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savingMessage, setSavingMessage] =
    useState("Creando plan...")

  const totalCredits = useMemo(
    () =>
      draft?.courses.reduce(
        (total, course) => total + course.credits,
        0,
      ) ?? 0,
    [draft],
  )

  const totalSemesters = useMemo(() => {
    if (!draft || draft.courses.length === 0) {
      return 0
    }

    return Math.max(
      ...draft.courses.map((course) => course.semester),
    )
  }, [draft])

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Selecciona un archivo PDF.")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("El PDF no puede superar los 10 MB.")
      return
    }

    try {
      setAnalyzing(true)

      const extracted =
        await extractPdfLayout(file)

      const generatedDraft =
        createAcademicPlanDraftFromLayout(
          extracted.text,
          extracted.items,
          file,
        )

      setDraft(generatedDraft)
      setStep(2)

      if (generatedDraft.courses.length === 0) {
        toast.warning(
          "No se detectaron materias automáticamente.",
          {
            description:
              "Puedes agregarlas manualmente antes de guardar.",
          },
        )
      } else {
        toast.success(
          `${generatedDraft.courses.length} materias detectadas.`,
        )
      }
    } catch (error) {
      console.error(error)
      toast.error(
        "No fue posible analizar este documento.",
      )
    } finally {
      setAnalyzing(false)

      if (fileInputReference.current) {
        fileInputReference.current.value = ""
      }
    }
  }

  function updateDraftField(
    field:
      | "name"
      | "institution"
      | "career"
      | "curriculum",
    value: string,
  ) {
    setDraft((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current,
    )
  }

  function updateCourse(
    temporaryId: string,
    field: keyof Omit<
      AcademicCourseDraft,
      "temporaryId"
    >,
    value: string | number,
  ) {
    setDraft((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        courses: current.courses.map((course) =>
          course.temporaryId === temporaryId
            ? {
                ...course,
                [field]: value,
              }
            : course,
        ),
      }
    })
  }

  function addCourse() {
    setDraft((current) => {
      if (!current) {
        return current
      }

      const lastSemester =
        current.courses.at(-1)?.semester ?? 1

      return {
        ...current,
        courses: [
          ...current.courses,
          createEmptyCourse(lastSemester),
        ],
      }
    })
  }

  function removeCourse(temporaryId: string) {
    setDraft((current) =>
      current
        ? {
            ...current,
            courses: current.courses.filter(
              (course) =>
                course.temporaryId !== temporaryId,
            ),
          }
        : current,
    )
  }

  function validateDraft() {
    if (!draft) {
      return false
    }

    if (draft.name.trim().length < 2) {
      toast.error("Escribe un nombre para el plan.")
      return false
    }

    if (draft.career.trim().length < 2) {
      toast.error("Escribe el nombre de la carrera.")
      return false
    }

    if (draft.courses.length === 0) {
      toast.error("Agrega al menos una materia.")
      return false
    }

    const invalidCourse = draft.courses.find(
      (course) =>
        course.name.trim().length < 2 ||
        course.semester < 1 ||
        course.credits < 0,
    )

    if (invalidCourse) {
      toast.error(
        "Revisa el nombre, semestre y créditos de las materias.",
      )
      return false
    }

    return true
  }

  async function handleConfirm() {
    if (!user || !draft || !validateDraft()) {
      return
    }

    try {
      setSaving(true)
      setSavingMessage("Subiendo PDF...")

      const planId =
        await createAcademicPlanFromDraft(
          user.uid,
          draft,
        )

      toast.success("Plan académico creado.", {
        description: `${draft.courses.length} materias guardadas.`,
      })

      setDraft(null)
      setStep(1)
      onCreated?.(planId)
    } catch (error) {
      console.error(error)

      toast.error(
        error instanceof Error
          ? error.message
          : "No fue posible crear el plan.",
      )
    } finally {
      setSaving(false)
      setSavingMessage("Creando plan...")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Importar retícula académica
        </CardTitle>

        <CardDescription>
          Analiza el PDF, corrige el borrador y confirma
          antes de guardar.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        <StepIndicator currentStep={step} />

        {step === 1 && (
          <section className="grid gap-5">
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileText className="size-8" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Selecciona la retícula
              </h3>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                El PDF debe pesar menos de 10 MB. Los
                documentos con texto seleccionable ofrecen
                mejores resultados.
              </p>

              <input
                ref={fileInputReference}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(event) =>
                  void handleFileChange(event)
                }
              />

              <Button
                type="button"
                className="mt-6"
                disabled={analyzing}
                onClick={() =>
                  fileInputReference.current?.click()
                }
              >
                {analyzing ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}

                {analyzing
                  ? "Analizando PDF..."
                  : "Seleccionar PDF"}
              </Button>
            </div>
          </section>
        )}

        {step === 2 && draft && (
          <section className="grid gap-7">
            <div className="grid gap-4 md:grid-cols-2">
              <DraftInput
                label="Nombre del plan"
                value={draft.name}
                onChange={(value) =>
                  updateDraftField("name", value)
                }
              />

              <DraftInput
                label="Institución"
                value={draft.institution}
                onChange={(value) =>
                  updateDraftField(
                    "institution",
                    value,
                  )
                }
              />

              <DraftInput
                label="Carrera o programa"
                value={draft.career}
                onChange={(value) =>
                  updateDraftField("career", value)
                }
              />

              <DraftInput
                label="Plan o retícula"
                value={draft.curriculum}
                onChange={(value) =>
                  updateDraftField(
                    "curriculum",
                    value,
                  )
                }
              />
            </div>

            <div className="grid gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold">
                    Materias detectadas
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Puedes editar, agregar o eliminar filas.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={addCourse}
                >
                  <Plus className="size-4" />
                  Agregar materia
                </Button>
              </div>

              <div className="grid gap-3">
                {draft.courses.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                    No hay materias. Agrégalas manualmente.
                  </div>
                ) : (
                  draft.courses.map(
                    (course, index) => (
                      <article
                        key={course.temporaryId}
                        className="grid gap-3 rounded-xl border p-4 lg:grid-cols-[70px_140px_1fr_110px_100px_auto]"
                      >
                        <div className="flex items-center text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </div>

                        <Input
                          value={course.code}
                          onChange={(event) =>
                            updateCourse(
                              course.temporaryId,
                              "code",
                              event.target.value,
                            )
                          }
                          placeholder="Clave"
                        />

                        <Input
                          value={course.name}
                          onChange={(event) =>
                            updateCourse(
                              course.temporaryId,
                              "name",
                              event.target.value,
                            )
                          }
                          placeholder="Nombre de la materia"
                        />

                        <Input
                          type="number"
                          min={1}
                          max={20}
                          value={course.semester}
                          onChange={(event) =>
                            updateCourse(
                              course.temporaryId,
                              "semester",
                              Number(event.target.value),
                            )
                          }
                          aria-label="Semestre"
                        />

                        <Input
                          type="number"
                          min={0}
                          max={30}
                          value={course.credits}
                          onChange={(event) =>
                            updateCourse(
                              course.temporaryId,
                              "credits",
                              Number(event.target.value),
                            )
                          }
                          aria-label="Créditos"
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeCourse(
                              course.temporaryId,
                            )
                          }
                          aria-label="Eliminar materia"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </article>
                    ),
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDraft(null)
                  setStep(1)
                }}
              >
                <ArrowLeft className="size-4" />
                Elegir otro PDF
              </Button>

              <Button
                type="button"
                onClick={() => {
                  if (validateDraft()) {
                    setStep(3)
                  }
                }}
              >
                Revisar resumen
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </section>
        )}

        {step === 3 && draft && (
          <section className="grid gap-6">
            <div className="rounded-2xl border bg-muted/30 p-6">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <BookOpen className="size-6" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl font-semibold">
                    {draft.career}
                  </h3>

                  <p className="mt-1 text-muted-foreground">
                    {draft.institution ||
                      "Institución no especificada"}
                  </p>

                  <p className="mt-2 text-sm">
                    Archivo: {draft.sourceFileName}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <SummaryStat
                  value={String(draft.courses.length)}
                  label="Materias"
                />

                <SummaryStat
                  value={String(totalSemesters)}
                  label="Semestres"
                />

                <SummaryStat
                  value={String(totalCredits)}
                  label="Créditos"
                />
              </div>
            </div>

            <div className="rounded-xl border border-dashed p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 text-primary" />

                <div>
                  <p className="font-medium">
                    Revisa antes de confirmar
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Después podrás cambiar estados y
                    calificaciones, pero esta acción creará el
                    plan, las materias y subirá el PDF.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                disabled={saving}
              >
                <ArrowLeft className="size-4" />
                Volver a editar
              </Button>

              <Button
                type="button"
                onClick={() => void handleConfirm()}
                disabled={saving}
              >
                {saving ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}

                {saving
                  ? savingMessage
                  : "Confirmar y crear plan"}
              </Button>
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  )
}

interface DraftInputProps {
  label: string
  value: string
  onChange: (value: string) => void
}

function DraftInput({
  label,
  value,
  onChange,
}: DraftInputProps) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>

      <Input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </div>
  )
}

function StepIndicator({
  currentStep,
}: {
  currentStep: number
}) {
  const steps = [
    "Subir PDF",
    "Editar borrador",
    "Confirmar",
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {steps.map((label, index) => {
        const number = index + 1
        const active = number <= currentStep

        return (
          <div
            key={label}
            className="grid gap-2 text-center"
          >
            <div
              className={[
                "mx-auto flex size-9 items-center justify-center rounded-full text-sm font-bold",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              ].join(" ")}
            >
              {number}
            </div>

            <span className="text-xs text-muted-foreground">
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function SummaryStat({
  value,
  label,
}: {
  value: string
  label: string
}) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <p className="text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
