import { emitUserEvent } from "@/features/events/utils/emit-user-event"
import type {
  AcademicCourseStatus,
} from "@/features/academic/types/academic-plan"

interface CourseEventContext {
  userId: string
  planId: string
  courseId: string
  courseName: string
  semester: number
  previousStatus?: AcademicCourseStatus
  status?: AcademicCourseStatus
  previousGrade?: number | null
  grade?: number | null
}

export function emitCourseStatusUpdatedEvent(
  context: CourseEventContext,
) {
  emitUserEvent({
    userId: context.userId,
    type: "course-updated",
    title: `Cambiaste el estado de ${context.courseName}`,
    metadata: {
      planId: context.planId,
      courseId: context.courseId,
      semester: context.semester,
      previousStatus:
        context.previousStatus ?? null,
      status: context.status ?? null,
    },
  })
}

export function emitCoursePassedEvent(
  context: CourseEventContext,
) {
  emitUserEvent({
    userId: context.userId,
    type: "course-passed",
    title: `Acreditaste ${context.courseName}`,
    description:
      context.grade === null ||
      context.grade === undefined
        ? undefined
        : `Calificación: ${context.grade}`,
    metadata: {
      planId: context.planId,
      courseId: context.courseId,
      semester: context.semester,
      previousStatus:
        context.previousStatus ?? null,
      status: context.status ?? "passed",
      grade: context.grade ?? null,
    },
  })
}

export function emitCourseFailedEvent(
  context: CourseEventContext,
) {
  emitUserEvent({
    userId: context.userId,
    type: "course-failed",
    title: `Marcaste como reprobada ${context.courseName}`,
    description:
      context.grade === null ||
      context.grade === undefined
        ? undefined
        : `Calificación: ${context.grade}`,
    metadata: {
      planId: context.planId,
      courseId: context.courseId,
      semester: context.semester,
      previousStatus:
        context.previousStatus ?? null,
      status: "failed",
      grade: context.grade ?? null,
    },
  })
}

export function emitGradeUpdatedEvent(
  context: CourseEventContext,
) {
  emitUserEvent({
    userId: context.userId,
    type: "grade-updated",
    title: `Actualizaste la calificación de ${context.courseName}`,
    description:
      context.grade === null ||
      context.grade === undefined
        ? "Calificación eliminada"
        : `Nueva calificación: ${context.grade}`,
    metadata: {
      planId: context.planId,
      courseId: context.courseId,
      semester: context.semester,
      previousGrade:
        context.previousGrade ?? null,
      grade: context.grade ?? null,
    },
  })
}
