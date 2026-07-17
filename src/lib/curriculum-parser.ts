import type {
  PositionedPdfText,
} from "@/lib/pdf"
import { parseCurriculumDocument } from "@/lib/curriculum-parsers"
import type {
  AcademicCourseDraft,
  AcademicPlanDraft,
} from "@/types/academic-plan"

const COURSE_CODE_PATTERN =
  /^[A-ZÁÉÍÓÚÑ]{3}-\d{4}$/i

function createTemporaryId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`
  )
}

function normalizeText(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/[|•·]/g, " ")
    .trim()
}

function detectInstitution(text: string) {
  const normalized = text.toLocaleLowerCase("es")

  if (
    normalized.includes("tecnm.mx") ||
    normalized.includes(
      "tecnológico nacional de méxico",
    )
  ) {
    return "Tecnológico Nacional de México"
  }

  const institutions = [
    "Instituto Politécnico Nacional",
    "Universidad Nacional Autónoma de México",
    "Universidad Autónoma Metropolitana",
  ]

  return (
    institutions.find((institution) =>
      normalized.includes(
        institution.toLocaleLowerCase("es"),
      ),
    ) ?? ""
  )
}

function detectCareer(text: string) {
  const normalized = normalizeText(text)

  const match = normalized.match(
    /(ingeniería|licenciatura|técnico superior universitario)\s+(en\s+)?[a-záéíóúñ ]{3,80}/i,
  )

  if (!match) {
    return ""
  }

  let career = match[0].trim()

  const stopPatterns = [
    /\s+[A-Z]{3}-\d{4}.*/i,
    /\s+\d+\s+\d+\s+\d+.*/,
  ]

  for (const pattern of stopPatterns) {
    career = career.replace(pattern, "").trim()
  }

  return career
}

function detectCurriculum(
  text: string,
  items: PositionedPdfText[],
) {
  const directMatch = text.match(
    /\b[A-Z]{3,5}-\d{4}-\d{2,4}\b/,
  )

  if (directMatch) {
    return directMatch[0]
  }

  const candidate = items.find((item) =>
    /^[A-Z]{3,5}-\d{4}-\d{2,4}$/.test(
      item.text,
    ),
  )

  return candidate?.text ?? ""
}

function clusterColumnCenters(
  codeItems: PositionedPdfText[],
) {
  const sortedCenters = codeItems
    .map((item) => item.x + item.width / 2)
    .sort((a, b) => a - b)

  const clusters: number[][] = []

  for (const center of sortedCenters) {
    const existing = clusters.find((cluster) => {
      const average =
        cluster.reduce((sum, value) => sum + value, 0) /
        cluster.length

      return Math.abs(average - center) < 24
    })

    if (existing) {
      existing.push(center)
    } else {
      clusters.push([center])
    }
  }

  return clusters
    .map(
      (cluster) =>
        cluster.reduce(
          (sum, value) => sum + value,
          0,
        ) / cluster.length,
    )
    .sort((a, b) => a - b)
}

function findClosestColumn(
  item: PositionedPdfText,
  centers: number[],
) {
  const itemCenter = item.x + item.width / 2

  let closestIndex = 0
  let closestDistance = Number.POSITIVE_INFINITY

  centers.forEach((center, index) => {
    const distance = Math.abs(center - itemCenter)

    if (distance < closestDistance) {
      closestIndex = index
      closestDistance = distance
    }
  })

  return closestIndex
}

function getCourseName(
  codeItem: PositionedPdfText,
  pageItems: PositionedPdfText[],
  columnCenter: number,
) {
  const candidates = pageItems.filter((item) => {
    const itemCenter = item.x + item.width / 2

    const isSameColumn =
      Math.abs(itemCenter - columnCenter) < 36

    const isAboveCode =
      item.y >= codeItem.y - 42 &&
      item.y < codeItem.y - 2

    const isUsefulText =
      !COURSE_CODE_PATTERN.test(item.text) &&
      !/^\d+$/.test(item.text) &&
      item.text.length > 1

    return (
      isSameColumn &&
      isAboveCode &&
      isUsefulText
    )
  })

  if (candidates.length === 0) {
    return ""
  }

  const groupedLines = new Map<
    number,
    PositionedPdfText[]
  >()

  for (const candidate of candidates) {
    const roundedY = Math.round(candidate.y / 3) * 3
    const line = groupedLines.get(roundedY) ?? []

    line.push(candidate)
    groupedLines.set(roundedY, line)
  }

  const lines = Array.from(groupedLines.entries())
    .sort(([firstY], [secondY]) => firstY - secondY)
    .map(([, lineItems]) =>
      lineItems
        .sort((a, b) => a.x - b.x)
        .map((item) => item.text)
        .join(" "),
    )
    .filter(Boolean)

  return normalizeText(lines.join(" "))
}

function getCourseCredits(
  codeItem: PositionedPdfText,
  pageItems: PositionedPdfText[],
  columnCenter: number,
) {
  const numericItems = pageItems
    .filter((item) => {
      const itemCenter = item.x + item.width / 2

      return (
        /^\d{1,2}$/.test(item.text) &&
        Math.abs(itemCenter - columnCenter) < 39 &&
        item.y > codeItem.y + 1 &&
        item.y < codeItem.y + 22
      )
    })
    .sort((a, b) => a.x - b.x)

  if (numericItems.length === 0) {
    return 0
  }

  const lastValue = Number(
    numericItems[numericItems.length - 1].text,
  )

  return Number.isFinite(lastValue)
    ? lastValue
    : 0
}

function detectCourses(
  items: PositionedPdfText[],
) {
  const firstPageItems = items.filter(
    (item) => item.page === 1,
  )

  const codeItems = firstPageItems.filter((item) =>
    COURSE_CODE_PATTERN.test(item.text),
  )

  const columnCenters =
    clusterColumnCenters(codeItems)

  const courses: AcademicCourseDraft[] = []

  for (const codeItem of codeItems) {
    const columnIndex = findClosestColumn(
      codeItem,
      columnCenters,
    )

    const semester = Math.min(
      columnIndex + 1,
      20,
    )

    const columnCenter =
      columnCenters[columnIndex] ??
      codeItem.x + codeItem.width / 2

    const name = getCourseName(
      codeItem,
      firstPageItems,
      columnCenter,
    )

    if (!name || name.length < 3) {
      continue
    }

    const credits = getCourseCredits(
      codeItem,
      firstPageItems,
      columnCenter,
    )

    const duplicate = courses.some(
      (course) =>
        course.code.toUpperCase() ===
        codeItem.text.toUpperCase(),
    )

    if (duplicate) {
      continue
    }

    courses.push({
      temporaryId: createTemporaryId(),
      code: codeItem.text.toUpperCase(),
      name,
      semester,
      credits,
    })
  }

  return courses.sort((a, b) => {
    if (a.semester !== b.semester) {
      return a.semester - b.semester
    }

    return a.name.localeCompare(b.name, "es")
  })
}

function createLegacyAcademicPlanDraftFromLayout(
  text: string,
  items: PositionedPdfText[],
  file: File,
): AcademicPlanDraft {
  const career =
    detectCareer(text) || "Ingeniería Informática"

  const institution = detectInstitution(text)
  const curriculum = detectCurriculum(
    text,
    items,
  )

  const courses = detectCourses(items)

  return {
    name:
      curriculum ||
      career ||
      file.name.replace(/\.pdf$/i, ""),
    institution,
    career,
    curriculum,
    courses,
    sourceFile: file,
    sourceFileName: file.name,
    extractedText: text,
  }
}


export function createAcademicPlanDraftFromLayout(
  text: string,
  items: PositionedPdfText[],
  file: File,
): AcademicPlanDraft {
  return parseCurriculumDocument({
    text,
    items,
    file,
    fallback: () =>
      createLegacyAcademicPlanDraftFromLayout(
        text,
        items,
        file,
      ),
  })
}

/**
 * Compatibilidad con código anterior.
 */
export function createAcademicPlanDraft(
  text: string,
  file: File,
): AcademicPlanDraft {
  return {
    name: file.name.replace(/\.pdf$/i, ""),
    institution: detectInstitution(text),
    career:
      detectCareer(text) ||
      "Ingeniería Informática",
    curriculum:
      text.match(
        /\b[A-Z]{3,5}-\d{4}-\d{2,4}\b/,
      )?.[0] ?? "",
    courses: [],
    sourceFile: file,
    sourceFileName: file.name,
    extractedText: text,
  }
}
