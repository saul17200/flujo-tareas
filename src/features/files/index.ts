export {
  updateFileAndEmit,
} from "@/features/files/utils/file-event-actions"

export {
  SubjectFiles,
} from "@/features/files/components/subject-files"

export {
  FileUpload,
} from "@/features/files/components/file-upload"

export {
  FileList,
} from "@/features/files/components/file-list"

export {
  FileCard,
} from "@/features/files/components/file-card"

export {
  FilePreviewDialog,
} from "@/features/files/components/file-preview-dialog"

export {
  observeSubjectFiles,
  uploadSubjectFile,
  updateSubjectFile,
  removeSubjectFile,
} from "@/features/files/services/subject-files"

export {
  formatFileSize,
  getFileCategory,
  getFileExtension,
  sanitizeFileName,
  validateSubjectFile,
  MAX_SUBJECT_FILE_SIZE,
} from "@/features/files/utils/file-utils"

export type {
  SubjectFile,
  SubjectFileCategory,
  SubjectFileUploadInput,
  SubjectFileUploadProgress,
} from "@/features/files/types/subject-file"
