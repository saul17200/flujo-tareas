import type {
  AcademicCourseDraft,
  AcademicPlanDraft,
} from "@/types/academic-plan"

const courseLinePatterns = [
  /^([A-ZÁÉÍÓÚÑ]{2,}\s?[-\d]{2,})\s+(.+?)\s+(\d{1,2})$/,
  /^([A-Z]{2,}\d{2,})\s+(.+?)\s+(\d{1,2})$/,
]

function createTemporaryId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  )
}

function cleanLine(line: string) {
  return line
    .replace(/\s+/g, " ")
    .replace(/[|•·]/g, " ")
    .trim()
}

function detectInstitution(text: string) {
  const candidates = [
    "Instituto Politécnico Nacional",
    "Tecnológico Nacional de México",
    "Universidad Nacional Autónoma de México",
    "Universidad Autónoma Metropolitana",
  ]

  return (
    candidates.find((candidate) =>
      text
        .toLocaleLowerCase("es")
        .includes(candidate.toLocaleLowerCase("es")),
    ) ?? ""
  )
}

function detectCareer(text: string) {
  const match = text.match(
    /(ingeniería|licenciatura|técnico superior universitario)\s+en\s+[^\n]{3,100}/i,
  )

  return match?.[0]?.trim() ?? ""
}

function detectCurriculum(text: string) {
  const match = text.match(
    /(plan|retícula)\s*(de estudios)?\s*[:\-]?\s*([A-Z0-9\-]{4,30})/i,
  )

  return match?.[0]?.trim() ?? ""
}

function detectSemester(line: string) {
  const numericMatch = line.match(
    /(?:semestre|nivel)\s*(\d{1,2})/i,
  )

  if (numericMatch) {
    return Number(numericMatch[1])
  }

  const names: Record<string, number> = {
    primero: 1,
    primer: 1,
    segundo: 2,
    tercero: 3,
    cuarto: 4,
    quinto: 5,
    sexto: 6,
    séptimo: 7,
    septimo: 7,
    octavo: 8,
    noveno: 9,
    décimo: 10,
    decimo: 10,
  }

  const lowerLine = line.toLocaleLowerCase("es")

  for (const [name, semester] of Object.entries(names)) {
    if (
      lowerLine.includes(name) &&
      lowerLine.includes("semestre")
    ) {
      return semester
    }
  }

  return null
}

function detectCourses(text: string) {
  const lines = text
    .split(/\n+/)
    .map(cleanLine)
    .filter((line) => line.length >= 5)

  const courses: AcademicCourseDraft[] = []
  let currentSemester = 1

  for (const line of lines) {
    const detectedSemester = detectSemester(line)

    if (detectedSemester) {
      currentSemester = detectedSemester
      continue
    }

    for (const pattern of courseLinePatterns) {
      const match = line.match(pattern)

      if (!match) {
        continue
      }

      const [, code, name, creditsText] = match
      const credits = Number(creditsText)

      if (
        name.length < 3 ||
        name.length > 120 ||
        credits < 0 ||
        credits > 30
      ) {
        continue
      }

      const duplicate = courses.some(
        (course) =>
          course.code === code &&
          course.semester === currentSemester,
      )

      if (!duplicate) {
        courses.push({
          temporaryId: createTemporaryId(),
          code: code.trim(),
          name: name.trim(),
          semester: currentSemester,
          credits,
        })
      }

      break
    }
  }

  return courses
}

export function createAcademicPlanDraft(
  text: string,
  file: File,
): AcademicPlanDraft {
  const career = detectCareer(text)
  const institution = detectInstitution(text)
  const curriculum = detectCurriculum(text)

  return {
    name: career || file.name.replace(/\.pdf$/i, ""),
    institution,
    career,
    curriculum,
    courses: detectCourses(text),
    sourceFile: file,
    sourceFileName: file.name,
    extractedText: text,
  }
}
