import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
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

function withTimeout<T>(
  promise: Promise<T>,
  milliseconds: number,
  message: string,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      window.setTimeout(() => {
        reject(new Error(message))
      }, milliseconds)
    }),
  ])
}

export async function uploadCurriculumPdf(
  userId: string,
  planId: string,
  file: File,
  onProgress?: (progress: number) => void,
) {
  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
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

  console.info("[Retícula] Iniciando subida:", {
    storagePath,
    fileName: file.name,
    size: file.size,
  })

  const uploadPromise = new Promise<void>(
    (resolve, reject) => {
      const uploadTask = uploadBytesResumable(
        fileReference,
        file,
        {
          contentType: "application/pdf",
        },
      )

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            snapshot.totalBytes > 0
              ? Math.round(
                  (snapshot.bytesTransferred /
                    snapshot.totalBytes) *
                    100,
                )
              : 0

          console.info(
            `[Retícula] Subida: ${progress}%`,
          )

          onProgress?.(progress)
        },
        (error) => {
          console.error(
            "[Retícula] Error de Storage:",
            error,
          )
          reject(error)
        },
        () => {
          console.info(
            "[Retícula] Archivo subido correctamente.",
          )
          resolve()
        },
      )
    },
  )

  await withTimeout(
    uploadPromise,
    60_000,
    "La subida del PDF tardó demasiado. Revisa Firebase Storage y vuelve a intentarlo.",
  )

  console.info(
    "[Retícula] Solicitando URL de descarga.",
  )

  const downloadUrl = await withTimeout(
    getDownloadURL(fileReference),
    20_000,
    "No fue posible obtener la URL del PDF.",
  )

  console.info(
    "[Retícula] URL obtenida correctamente.",
  )

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
