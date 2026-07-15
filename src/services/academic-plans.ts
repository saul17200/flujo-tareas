import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type {
  AcademicPlan,
  CreateAcademicPlanInput,
} from "@/types/academic-plan"

function academicPlansCollection(userId: string) {
  return collection(
    db,
    "users",
    userId,
    "academicPlans",
  )
}

export function observeAcademicPlans(
  userId: string,
  onPlans: (plans: AcademicPlan[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    academicPlansCollection(userId),
    (snapshot) => {
      const plans: AcademicPlan[] = snapshot.docs
        .map((planDocument) => {
          const data = planDocument.data()

          return {
            id: planDocument.id,
            name: String(data.name ?? ""),
            institution: String(data.institution ?? ""),
            career: String(data.career ?? ""),
            curriculum: String(data.curriculum ?? ""),
            pdfName:
              typeof data.pdfName === "string"
                ? data.pdfName
                : null,
            pdfPath:
              typeof data.pdfPath === "string"
                ? data.pdfPath
                : null,
            pdfUrl:
              typeof data.pdfUrl === "string"
                ? data.pdfUrl
                : null,
            totalCredits:
              typeof data.totalCredits === "number"
                ? data.totalCredits
                : 0,
            totalSemesters:
              typeof data.totalSemesters === "number"
                ? data.totalSemesters
                : 0,
            createdAt: String(
              data.createdAt ?? new Date().toISOString(),
            ),
            updatedAt: String(
              data.updatedAt ??
                data.createdAt ??
                new Date().toISOString(),
            ),
          }
        })
        .sort((a, b) =>
          a.name.localeCompare(b.name, "es"),
        )

      onPlans(plans)
    },
    onError,
  )
}

export async function createAcademicPlan(
  userId: string,
  input: CreateAcademicPlanInput,
) {
  const now = new Date().toISOString()

  await addDoc(academicPlansCollection(userId), {
    name: input.name.trim(),
    institution: input.institution.trim(),
    career: input.career.trim(),
    curriculum: input.curriculum.trim(),
    createdAt: now,
    updatedAt: now,
  })
}

export async function updateAcademicPlan(
  userId: string,
  planId: string,
  input: Partial<CreateAcademicPlanInput>,
) {
  await updateDoc(
    doc(
      db,
      "users",
      userId,
      "academicPlans",
      planId,
    ),
    {
      ...input,
      updatedAt: new Date().toISOString(),
    },
  )
}

export async function removeAcademicPlan(
  userId: string,
  planId: string,
) {
  await deleteDoc(
    doc(
      db,
      "users",
      userId,
      "academicPlans",
      planId,
    ),
  )
}
