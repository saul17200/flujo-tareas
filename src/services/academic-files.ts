import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage"

import { storage } from "@/lib/firebase"

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
}

export async function uploadCurriculumPdf(
  userId: string,
  planId: string,
  file: File,
) {
  if (file.type !== "application/pdf") {
    throw new Error("El archivo debe ser un PDF.")
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error(
      "El PDF no puede superar los 10 MB.",
    )
  }

  const safeName = sanitizeFileName(file.name)

  const storagePath =
    `users/${userId}/academic-plans/` +
    `${planId}/${safeName}`

  const fileReference = ref(storage, storagePath)

  await uploadBytes(fileReference, file, {
    contentType: "application/pdf",
  })

  const downloadUrl =
    await getDownloadURL(fileReference)

  return {
    pdfName: file.name,
    pdfPath: storagePath,
    pdfUrl: downloadUrl,
  }
}

export async function removeCurriculumPdf(
  storagePath: string,
) {
  await deleteObject(ref(storage, storagePath))
}
