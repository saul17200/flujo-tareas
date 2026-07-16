import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage"

import { db, storage } from "@/lib/firebase"
import {
  getFileCategory,
  getFileExtension,
  sanitizeFileName,
  validateSubjectFile,
} from "@/lib/file-utils"
import type {
  SubjectFile,
  SubjectFileUploadInput,
  SubjectFileUploadProgress,
} from "@/types/subject-file"

function filesCollection(
  userId: string,
  planId: string,
  courseId: string,
) {
  return collection(
    db,
    "users",
    userId,
    "academicPlans",
    planId,
    "courses",
    courseId,
    "files",
  )
}

function fileDocument(
  userId: string,
  planId: string,
  courseId: string,
  fileId: string,
) {
  return doc(
    db,
    "users",
    userId,
    "academicPlans",
    planId,
    "courses",
    courseId,
    "files",
    fileId,
  )
}

function createStoragePath(
  userId: string,
  planId: string,
  courseId: string,
  fileId: string,
  fileName: string,
) {
  return [
    "users",
    userId,
    "academic-plans",
    planId,
    "courses",
    courseId,
    "files",
    fileId,
    sanitizeFileName(fileName),
  ].join("/")
}

function parseSubjectFile(
  id: string,
  data: Record<string, unknown>,
): SubjectFile {
  return {
    id,
    name: String(
      data.name ??
        data.originalName ??
        "Archivo",
    ),
    originalName: String(
      data.originalName ??
        data.name ??
        "Archivo",
    ),
    storagePath: String(
      data.storagePath ?? "",
    ),
    downloadUrl: String(
      data.downloadUrl ?? "",
    ),
    mimeType: String(
      data.mimeType ??
        "application/octet-stream",
    ),
    category:
      (typeof data.category === "string"
        ? data.category
        : "other") as SubjectFile["category"],
    size:
      typeof data.size === "number"
        ? data.size
        : 0,
    extension: String(data.extension ?? ""),
    description: String(
      data.description ?? "",
    ),
    favorite: data.favorite === true,
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
}

export function observeSubjectFiles(
  userId: string,
  planId: string,
  courseId: string,
  onFiles: (files: SubjectFile[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    filesCollection(
      userId,
      planId,
      courseId,
    ),
    (snapshot) => {
      const files = snapshot.docs
        .map((fileSnapshot) =>
          parseSubjectFile(
            fileSnapshot.id,
            fileSnapshot.data(),
          ),
        )
        .sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt),
        )

      onFiles(files)
    },
    onError,
  )
}

export async function uploadSubjectFile(
  userId: string,
  planId: string,
  courseId: string,
  input: SubjectFileUploadInput,
  onProgress?: (
    progress: SubjectFileUploadProgress,
  ) => void,
) {
  validateSubjectFile(input.file)

  const metadataReference = doc(
    filesCollection(
      userId,
      planId,
      courseId,
    ),
  )

  const storagePath = createStoragePath(
    userId,
    planId,
    courseId,
    metadataReference.id,
    input.file.name,
  )

  const storageReference = ref(
    storage,
    storagePath,
  )

  const uploadTask = uploadBytesResumable(
    storageReference,
    input.file,
    {
      contentType:
        input.file.type ||
        "application/octet-stream",
      customMetadata: {
        userId,
        planId,
        courseId,
        fileId: metadataReference.id,
        originalName: input.file.name,
      },
    },
  )

  try {
    await new Promise<void>(
      (resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percentage =
              snapshot.totalBytes > 0
                ? Math.round(
                    (snapshot.bytesTransferred /
                      snapshot.totalBytes) *
                      100,
                  )
                : 0

            onProgress?.({
              transferredBytes:
                snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              percentage,
            })
          },
          reject,
          resolve,
        )
      },
    )

    const downloadUrl =
      await getDownloadURL(storageReference)

    const now = new Date().toISOString()

    const subjectFile: SubjectFile = {
      id: metadataReference.id,
      name: input.file.name,
      originalName: input.file.name,
      storagePath,
      downloadUrl,
      mimeType:
        input.file.type ||
        "application/octet-stream",
      category: getFileCategory(
        input.file.type,
        input.file.name,
      ),
      size: input.file.size,
      extension: getFileExtension(
        input.file.name,
      ),
      description:
        input.description?.trim() ?? "",
      favorite: false,
      createdAt: now,
      updatedAt: now,
    }

    await setDoc(
      metadataReference,
      subjectFile,
    )

    return subjectFile
  } catch (error) {
    try {
      await deleteObject(storageReference)
    } catch {
      // El archivo podría no haberse subido todavía.
    }

    throw error
  }
}

export async function updateSubjectFile(
  userId: string,
  planId: string,
  courseId: string,
  fileId: string,
  input: {
    name?: string
    description?: string
    favorite?: boolean
  },
) {
  const updateData: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  }

  if (typeof input.name === "string") {
    const cleanName = input.name.trim()

    if (!cleanName) {
      throw new Error(
        "El archivo necesita un nombre.",
      )
    }

    updateData.name = cleanName
  }

  if (typeof input.description === "string") {
    updateData.description =
      input.description.trim()
  }

  if (typeof input.favorite === "boolean") {
    updateData.favorite = input.favorite
  }

  await updateDoc(
    fileDocument(
      userId,
      planId,
      courseId,
      fileId,
    ),
    updateData,
  )
}

export async function removeSubjectFile(
  userId: string,
  planId: string,
  courseId: string,
  subjectFile: SubjectFile,
) {
  if (subjectFile.storagePath) {
    await deleteObject(
      ref(storage, subjectFile.storagePath),
    )
  }

  await deleteDoc(
    fileDocument(
      userId,
      planId,
      courseId,
      subjectFile.id,
    ),
  )
}
