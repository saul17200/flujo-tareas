import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  writeBatch,
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import {
  removeCurriculumPdf,
  uploadCurriculumPdf,
} from "@/features/academic/services/academic-files"
import type {
  AcademicPlan,
  AcademicPlanDraft,
  CreateAcademicPlanInput,
} from "@/features/academic/types/academic-plan"

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

export async function createAcademicPlanFromDraft(
  userId: string,
  draft: AcademicPlanDraft,
) {
  if (!draft.sourceFile) {
    throw new Error("Selecciona el PDF de la retícula.")
  }

  if (!draft.name.trim()) {
    throw new Error("El plan necesita un nombre.")
  }

  if (!draft.career.trim()) {
    throw new Error("Escribe el nombre de la carrera.")
  }

  if (draft.courses.length === 0) {
    throw new Error(
      "Agrega al menos una materia antes de continuar.",
    )
  }

  const planReference = doc(
    academicPlansCollection(userId),
  )

  let uploadedPdfPath: string | null = null

  try {
    console.info(
      "[Retícula] Paso 1: subiendo PDF.",
    )

    const pdfData = await uploadCurriculumPdf(
      userId,
      planReference.id,
      draft.sourceFile,
      (progress) => {
        console.info(
          `[Retícula] Progreso recibido: ${progress}%`,
        )
      },
    )

    console.info(
      "[Retícula] Paso 2: preparando Firestore.",
    )

    uploadedPdfPath = pdfData.pdfPath

    const now = new Date().toISOString()

    const totalCredits = draft.courses.reduce(
      (total, course) => total + course.credits,
      0,
    )

    const totalSemesters = Math.max(
      ...draft.courses.map((course) => course.semester),
      1,
    )

    const batch = writeBatch(db)

    batch.set(planReference, {
      name: draft.name.trim(),
      institution: draft.institution.trim(),
      career: draft.career.trim(),
      curriculum: draft.curriculum.trim(),
      pdfName: pdfData.pdfName,
      pdfPath: pdfData.pdfPath,
      pdfUrl: pdfData.pdfUrl,
      totalCredits,
      totalSemesters,
      createdAt: now,
      updatedAt: now,
    })

    draft.courses.forEach((course) => {
      const courseReference = doc(
        collection(
          db,
          "users",
          userId,
          "academicPlans",
          planReference.id,
          "courses",
        ),
      )

      batch.set(courseReference, {
        code: course.code.trim(),
        name: course.name.trim(),
        semester: course.semester,
        credits: course.credits,
        status: "pending",
        grade: null,
        createdAt: now,
        updatedAt: now,
      })
    })

    console.info(
      "[Retícula] Paso 3: guardando lote en Firestore.",
      {
        planId: planReference.id,
        courses: draft.courses.length,
      },
    )

    await Promise.race([
      batch.commit(),
      new Promise<never>((_, reject) => {
        window.setTimeout(() => {
          reject(
            new Error(
              "Firestore tardó demasiado en guardar el plan.",
            ),
          )
        }, 60_000)
      }),
    ])

    console.info(
      "[Retícula] Plan guardado correctamente.",
    )

    return planReference.id
  } catch (error) {
    if (uploadedPdfPath) {
      try {
        await removeCurriculumPdf(uploadedPdfPath)
      } catch (cleanupError) {
        console.error(
          "No fue posible limpiar el PDF:",
          cleanupError,
        )
      }
    }

    throw error
  }
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
  pdfPath?: string | null,
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

  if (pdfPath) {
    await removeCurriculumPdf(pdfPath)
  }
}
