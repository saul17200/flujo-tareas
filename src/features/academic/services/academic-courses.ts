import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type {
  AcademicCourse,
  AcademicCourseStatus,
} from "@/features/academic/types/academic-plan"

function coursesCollection(
  userId: string,
  planId: string,
) {
  return collection(
    db,
    "users",
    userId,
    "academicPlans",
    planId,
    "courses",
  )
}

function courseDocument(
  userId: string,
  planId: string,
  courseId: string,
) {
  return doc(
    db,
    "users",
    userId,
    "academicPlans",
    planId,
    "courses",
    courseId,
  )
}

export function observeAcademicCourses(
  userId: string,
  planId: string,
  onCourses: (courses: AcademicCourse[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    coursesCollection(userId, planId),
    (snapshot) => {
      const courses: AcademicCourse[] =
        snapshot.docs
          .map((courseDocumentSnapshot) => {
            const data =
              courseDocumentSnapshot.data()

            const validStatuses:
              AcademicCourseStatus[] = [
                "pending",
                "in-progress",
                "passed",
                "failed",
                "validated",
              ]

            const status =
              typeof data.status === "string" &&
              validStatuses.includes(
                data.status as AcademicCourseStatus,
              )
                ? (data.status as AcademicCourseStatus)
                : "pending"

            return {
              id: courseDocumentSnapshot.id,
              code: String(data.code ?? ""),
              name: String(data.name ?? ""),
              semester:
                typeof data.semester === "number"
                  ? data.semester
                  : 1,
              credits:
                typeof data.credits === "number"
                  ? data.credits
                  : 0,
              status,
              grade:
                typeof data.grade === "number"
                  ? data.grade
                  : null,
              createdAt: String(
                data.createdAt ??
                  new Date().toISOString(),
              ),
              updatedAt: String(
                data.updatedAt ??
                  data.createdAt ??
                  new Date().toISOString(),
              ),
            }
          })
          .sort((a, b) => {
            if (a.semester !== b.semester) {
              return a.semester - b.semester
            }

            return a.name.localeCompare(
              b.name,
              "es",
            )
          })

      onCourses(courses)
    },
    onError,
  )
}


export function observeAcademicCourse(
  userId: string,
  planId: string,
  courseId: string,
  onCourse: (course: AcademicCourse | null) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    courseDocument(userId, planId, courseId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onCourse(null)
        return
      }

      const data = snapshot.data()

      const validStatuses: AcademicCourseStatus[] = [
        "pending",
        "in-progress",
        "passed",
        "failed",
        "validated",
      ]

      const status =
        typeof data.status === "string" &&
        validStatuses.includes(
          data.status as AcademicCourseStatus,
        )
          ? (data.status as AcademicCourseStatus)
          : "pending"

      onCourse({
        id: snapshot.id,
        code: String(data.code ?? ""),
        name: String(data.name ?? ""),
        semester:
          typeof data.semester === "number"
            ? data.semester
            : 1,
        credits:
          typeof data.credits === "number"
            ? data.credits
            : 0,
        status,
        grade:
          typeof data.grade === "number"
            ? data.grade
            : null,
        createdAt: String(
          data.createdAt ?? new Date().toISOString(),
        ),
        updatedAt: String(
          data.updatedAt ??
            data.createdAt ??
            new Date().toISOString(),
        ),
      })
    },
    onError,
  )
}

interface UpdateAcademicCourseInput {
  status?: AcademicCourseStatus
  grade?: number | null
  semester?: number
  credits?: number
  code?: string
  name?: string
}

export async function updateAcademicCourse(
  userId: string,
  planId: string,
  courseId: string,
  input: UpdateAcademicCourseInput,
) {
  await updateDoc(
    courseDocument(
      userId,
      planId,
      courseId,
    ),
    {
      ...input,
      updatedAt: new Date().toISOString(),
    },
  )
}
