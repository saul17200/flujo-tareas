import type {
  SubjectFileCategory,
} from "@/types/subject-file"

const MIME_TYPE_CATEGORIES: Record<
  string,
  SubjectFileCategory
> = {
  "application/pdf": "pdf",

  "application/msword": "document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "document",
  "text/plain": "document",
  "text/markdown": "document",
  "application/rtf": "document",

  "application/vnd.ms-excel": "spreadsheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "spreadsheet",
  "text/csv": "spreadsheet",

  "application/vnd.ms-powerpoint": "presentation",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "presentation",

  "application/zip": "archive",
  "application/x-zip-compressed": "archive",
  "application/x-rar-compressed": "archive",
  "application/vnd.rar": "archive",
  "application/x-7z-compressed": "archive",

  "text/html": "code",
  "text/css": "code",
  "text/javascript": "code",
  "application/javascript": "code",
  "application/json": "code",
  "application/xml": "code",
}

const CODE_EXTENSIONS = new Set([
  "c",
  "cpp",
  "cs",
  "css",
  "go",
  "h",
  "html",
  "java",
  "js",
  "jsx",
  "json",
  "kt",
  "md",
  "php",
  "py",
  "rb",
  "rs",
  "sql",
  "swift",
  "ts",
  "tsx",
  "xml",
  "yaml",
  "yml",
])

const ARCHIVE_EXTENSIONS = new Set([
  "7z",
  "gz",
  "rar",
  "tar",
  "zip",
])

export const MAX_SUBJECT_FILE_SIZE =
  25 * 1024 * 1024

export function getFileExtension(
  fileName: string,
) {
  const lastDotIndex = fileName.lastIndexOf(".")

  if (
    lastDotIndex < 0 ||
    lastDotIndex === fileName.length - 1
  ) {
    return ""
  }

  return fileName
    .slice(lastDotIndex + 1)
    .toLowerCase()
}

export function sanitizeFileName(
  fileName: string,
) {
  const extension = getFileExtension(fileName)

  const baseName = extension
    ? fileName.slice(
        0,
        -(extension.length + 1),
      )
    : fileName

  const safeBaseName = baseName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()

  const finalBaseName =
    safeBaseName || `archivo-${Date.now()}`

  return extension
    ? `${finalBaseName}.${extension}`
    : finalBaseName
}

export function getFileCategory(
  mimeType: string,
  fileName: string,
): SubjectFileCategory {
  if (mimeType.startsWith("image/")) {
    return "image"
  }

  const directCategory =
    MIME_TYPE_CATEGORIES[mimeType]

  if (directCategory) {
    return directCategory
  }

  const extension = getFileExtension(fileName)

  if (CODE_EXTENSIONS.has(extension)) {
    return "code"
  }

  if (ARCHIVE_EXTENSIONS.has(extension)) {
    return "archive"
  }

  return "other"
}

export function formatFileSize(
  size: number,
) {
  if (size < 1024) {
    return `${size} B`
  }

  const kilobytes = size / 1024

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`
  }

  const megabytes = kilobytes / 1024

  return `${megabytes.toFixed(1)} MB`
}

export function validateSubjectFile(
  file: File,
) {
  if (file.size === 0) {
    throw new Error("El archivo está vacío.")
  }

  if (file.size > MAX_SUBJECT_FILE_SIZE) {
    throw new Error(
      "El archivo no puede superar los 25 MB.",
    )
  }

  const blockedExtensions = new Set([
    "apk",
    "app",
    "bat",
    "cmd",
    "com",
    "dmg",
    "exe",
    "jar",
    "msi",
    "pkg",
    "scr",
  ])

  const extension = getFileExtension(file.name)

  if (blockedExtensions.has(extension)) {
    throw new Error(
      "Este tipo de archivo no está permitido.",
    )
  }
}
