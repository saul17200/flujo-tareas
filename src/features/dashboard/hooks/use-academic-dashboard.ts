import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  observeAcademicCourses,
  observeAcademicPlans,
  type AcademicCourse,
  type AcademicPlan,
} from "@/features/academic"
import { useAuth } from "@/features/auth/auth-provider"
import { useTaskStore } from "@/store/task-store"

const ACTIVE_PLAN_STORAGE_KEY =
  "drif-notion-active-academic-plan"

function isAccredited(course: AcademicCourse) {
  return (
    course.status === "passed" ||
    course.status === "validated"
  )
}

function parseTaskDate(value: string | null) {
  if (!value) {
    return null
  }

  const parsedDate = new Date(value)

  return Number.isNaN(parsedDate.getTime())
    ? null
    : parsedDate
}

export function useAcademicDashboard() {
  const { user } = useAuth()
  const tasks = useTaskStore((state) => state.tasks)

  const [plans, setPlans] = useState<AcademicPlan[]>([])
  const [courses, setCourses] = useState<
    AcademicCourse[]
  >([])
  const [activePlanId, setActivePlanId] =
    useState<string | null>(() =>
      localStorage.getItem(
        ACTIVE_PLAN_STORAGE_KEY,
      ),
    )

  const [loadingPlans, setLoadingPlans] =
    useState(true)
  const [loadingCourses, setLoadingCourses] =
    useState(false)

  useEffect(() => {
    if (!user) {
      setPlans([])
      setCourses([])
      setLoadingPlans(false)
      return
    }

    setLoadingPlans(true)

    return observeAcademicPlans(
      user.uid,
      (nextPlans) => {
        setPlans(nextPlans)
        setLoadingPlans(false)

        const storedPlanStillExists =
          nextPlans.some(
            (plan) => plan.id === activePlanId,
          )

        if (
          !storedPlanStillExists &&
          nextPlans.length > 0
        ) {
          const nextPlanId = nextPlans[0].id

          setActivePlanId(nextPlanId)

          localStorage.setItem(
            ACTIVE_PLAN_STORAGE_KEY,
            nextPlanId,
          )
        }

        if (nextPlans.length === 0) {
          setActivePlanId(null)
          setCourses([])

          localStorage.removeItem(
            ACTIVE_PLAN_STORAGE_KEY,
          )
        }
      },
      (error) => {
        console.error(
          "Error al cargar planes del dashboard:",
          error,
        )

        setLoadingPlans(false)
      },
    )
  }, [activePlanId, user])

  useEffect(() => {
    if (!user || !activePlanId) {
      setCourses([])
      setLoadingCourses(false)
      return
    }

    setLoadingCourses(true)

    return observeAcademicCourses(
      user.uid,
      activePlanId,
      (nextCourses) => {
        setCourses(nextCourses)
        setLoadingCourses(false)
      },
      (error) => {
        console.error(
          "Error al cargar materias del dashboard:",
          error,
        )

        setLoadingCourses(false)
      },
    )
  }, [activePlanId, user])

  const activePlan =
    plans.find(
      (plan) => plan.id === activePlanId,
    ) ?? null

  const statistics = useMemo(() => {
    const accreditedCourses =
      courses.filter(isAccredited)

    const inProgressCourses =
      courses.filter(
        (course) =>
          course.status === "in-progress",
      )

    const gradedCourses =
      accreditedCourses.filter(
        (course) => course.grade !== null,
      )

    const average =
      gradedCourses.length > 0
        ? gradedCourses.reduce(
            (total, course) =>
              total + (course.grade ?? 0),
            0,
          ) / gradedCourses.length
        : null

    const earnedCredits =
      accreditedCourses.reduce(
        (total, course) =>
          total + course.credits,
        0,
      )

    const totalCredits =
      activePlan?.totalCredits &&
      activePlan.totalCredits > 0
        ? activePlan.totalCredits
        : courses.reduce(
            (total, course) =>
              total + course.credits,
            0,
          )

    const progress =
      totalCredits > 0
        ? Math.min(
            100,
            Math.round(
              (earnedCredits / totalCredits) *
                100,
            ),
          )
        : 0

    return {
      accredited:
        accreditedCourses.length,
      inProgress:
        inProgressCourses.length,
      average,
      earnedCredits,
      totalCredits,
      progress,
    }
  }, [activePlan?.totalCredits, courses])

  const nextTask = useMemo(() => {
    return tasks
      .filter(
        (task) =>
          task.status !== "completed" &&
          parseTaskDate(task.dueDate) !== null,
      )
      .sort((firstTask, secondTask) => {
        const firstDate =
          parseTaskDate(firstTask.dueDate)
            ?.getTime() ??
          Number.POSITIVE_INFINITY

        const secondDate =
          parseTaskDate(secondTask.dueDate)
            ?.getTime() ??
          Number.POSITIVE_INFINITY

        return firstDate - secondDate
      })[0] ?? null
  }, [tasks])

  return {
    activePlan,
    courses,
    statistics,
    nextTask,
    loading:
      loadingPlans || loadingCourses,
  }
}
