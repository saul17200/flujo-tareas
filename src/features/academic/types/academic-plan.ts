export type AcademicCourseStatus =
  | "pending"
  | "in-progress"
  | "passed"
  | "failed"
  | "validated"

export interface AcademicPlan {
  id: string
  name: string
  institution: string
  career: string
  curriculum: string
  pdfName: string | null
  pdfPath: string | null
  pdfUrl: string | null
  totalCredits: number
  totalSemesters: number
  createdAt: string
  updatedAt: string
}

export interface CreateAcademicPlanInput {
  name: string
  institution: string
  career: string
  curriculum: string
}

export interface AcademicCourseDraft {
  temporaryId: string
  code: string
  name: string
  semester: number
  credits: number
}

export interface AcademicPlanDraft {
  name: string
  institution: string
  career: string
  curriculum: string
  courses: AcademicCourseDraft[]
  sourceFile: File | null
  sourceFileName: string | null
  extractedText: string
}

export interface AcademicCourse {
  id: string
  code: string
  name: string
  semester: number
  credits: number
  status: AcademicCourseStatus
  grade: number | null
  createdAt: string
  updatedAt: string
}
