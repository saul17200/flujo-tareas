import {
  useEffect,
  useState,
} from "react"
import {
  BookOpen,
  Building2,
  Check,
  GraduationCap,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { AcademicPlanWizard } from "@/features/academic"
import { AcademicPlanProgress } from "@/features/academic"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/features/auth/auth-provider"
import {
  observeAcademicPlans,
  removeAcademicPlan,
} from "@/features/academic"
import type { AcademicPlan } from "@/features/academic"

const ACTIVE_PLAN_STORAGE_KEY =
  "drif-notion-active-academic-plan"

export function CareerPage() {
  const { user } = useAuth()

  const [plans, setPlans] = useState<AcademicPlan[]>([])
  const [activePlanId, setActivePlanId] = useState<
    string | null
  >(() => localStorage.getItem(ACTIVE_PLAN_STORAGE_KEY))

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setPlans([])
      setLoading(false)
      return
    }

    setLoading(true)

    return observeAcademicPlans(
      user.uid,
      (nextPlans) => {
        setPlans(nextPlans)
        setLoading(false)

        const activeStillExists = nextPlans.some(
          (plan) => plan.id === activePlanId,
        )

        if (!activeStillExists && nextPlans.length > 0) {
          const firstPlanId = nextPlans[0].id

          setActivePlanId(firstPlanId)
          localStorage.setItem(
            ACTIVE_PLAN_STORAGE_KEY,
            firstPlanId,
          )
        }

        if (nextPlans.length === 0) {
          setActivePlanId(null)
          localStorage.removeItem(
            ACTIVE_PLAN_STORAGE_KEY,
          )
        }
      },
      (error) => {
        console.error(error)
        setLoading(false)

        toast.error(
          "No fue posible cargar tus planes académicos.",
        )
      },
    )
  }, [activePlanId, user])

  function selectPlan(planId: string) {
    setActivePlanId(planId)

    localStorage.setItem(
      ACTIVE_PLAN_STORAGE_KEY,
      planId,
    )
  }

  async function handleDelete(plan: AcademicPlan) {
    if (!user) {
      return
    }

    const confirmed = window.confirm(
      `¿Eliminar el plan "${plan.name}"?`,
    )

    if (!confirmed) {
      return
    }

    try {
      await removeAcademicPlan(user.uid, plan.id)

      toast.success("Plan académico eliminado.")
    } catch (error) {
      console.error(error)

      toast.error(
        "No fue posible eliminar el plan académico.",
      )
    }
  }

  const activePlan =
    plans.find((plan) => plan.id === activePlanId) ??
    null

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
          <GraduationCap className="size-4" />
          Seguimiento académico
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Mi carrera
        </h1>

        <p className="mt-2 text-muted-foreground">
          Administra tus carreras, planes de estudio y
          progreso académico.
        </p>
      </section>


      <AcademicPlanWizard
        onCreated={(planId) => {
          setActivePlanId(planId)
          localStorage.setItem(
            ACTIVE_PLAN_STORAGE_KEY,
            planId,
          )
        }}
      />

      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="grid gap-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Planes académicos</CardTitle>

              <CardDescription>
                Puedes registrar varias carreras o programas.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
                  Cargando planes...
                </div>
              ) : plans.length === 0 ? (
                <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed text-center">
                  <GraduationCap className="mb-3 size-10 text-muted-foreground" />

                  <p className="font-medium">
                    No tienes planes registrados
                  </p>

                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Crea tu primer plan académico para comenzar
                    a registrar materias y avance.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {plans.map((plan) => {
                    const active =
                      plan.id === activePlanId

                    return (
                      <article
                        key={plan.id}
                        className={[
                          "rounded-xl border p-4 transition-colors",
                          active
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/40",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              selectPlan(plan.id)
                            }
                            className="min-w-0 flex-1 text-left"
                          >
                            <div className="flex items-center gap-2">
                              <h3 className="truncate font-semibold">
                                {plan.name}
                              </h3>

                              {active && (
                                <Badge>
                                  <Check className="size-3" />
                                  Activo
                                </Badge>
                              )}
                            </div>

                            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <BookOpen className="size-4 shrink-0" />

                              <span className="truncate">
                                {plan.career}
                              </span>
                            </p>

                            {plan.institution && (
                              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="size-4 shrink-0" />

                                <span className="truncate">
                                  {plan.institution}
                                </span>
                              </p>
                            )}
                          </button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              void handleDelete(plan)
                            }
                            aria-label={`Eliminar ${plan.name}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plan activo</CardTitle>

              <CardDescription>
                Aquí aparecerán las materias, créditos y
                estadísticas del plan seleccionado.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {activePlan ? (
                <div className="rounded-xl border bg-muted/30 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <GraduationCap className="size-6" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold">
                        {activePlan.career}
                      </h3>

                      <p className="mt-1 text-muted-foreground">
                        {activePlan.institution ||
                          "Institución no especificada"}
                      </p>

                      <Badge
                        variant="secondary"
                        className="mt-3"
                      >
                        {activePlan.curriculum ||
                          "Plan sin especificar"}
                      </Badge>
                    </div>
                  </div>


                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  Selecciona o crea un plan académico.
                </div>
              )}
            </CardContent>
          </Card>
        </div>


          {activePlan && (
            <AcademicPlanProgress
              plan={activePlan}
            />
          )}
      </section>
    </div>
  )
}

