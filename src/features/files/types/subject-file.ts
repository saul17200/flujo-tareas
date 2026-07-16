export type SubjectFileCategory =
  | "document"
  | "pdf"
  | "image"
  | "spreadsheet"
  | "presentation"
  | "archive"
  | "code"
  | "other"

export interface SubjectFile {
  id: string
  name: string
  originalName: string
  storagePath: string
  downloadUrl: string
  mimeType: string
  category: SubjectFileCategory
  size: number
  extension: string
  description: string
  favorite: boolean
  createdAt: string
  updatedAt: string
}

export interface SubjectFileUploadInput {
  file: File
  description?: string
}

export interface SubjectFileUploadProgress {
  transferredBytes: number
  totalBytes: number
  percentage: number
}
