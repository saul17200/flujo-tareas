import type { PositionedPdfText } from "@/lib/pdf"
import type {
  AcademicCourseDraft,
  AcademicPlanDraft,
} from "@/features/academic/types/academic-plan"

interface PdfLine {
  y: number
  pageWidth: number
  items: PositionedPdfText[]
  text: string
}

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
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .replace(/[|•·]/g, " ")
    .trim()
}

function normalizeForSearch(value: string) {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleUpperCase("es")
}

function isNumeric(value: string) {
  return /^\d+(?:[.,]\d+)?$/.test(value.trim())
}

function parseNumber(value: string) {
  const number = Number(
    value.replace(",", "."),
  )

  return Number.isFinite(number)
    ? number
    : null
}

function groupItemsIntoLines(
  items: PositionedPdfText[],
  tolerance = 4,
) {
  const sortedItems = [...items].sort(
    (first, second) => {
      if (Math.abs(first.y - second.y) > tolerance) {
        return first.y - second.y
      }

      return first.x - second.x
    },
  )

  const lines: PdfLine[] = []

  for (const item of sortedItems) {
    const existingLine = lines.find(
      (line) =>
        Math.abs(line.y - item.y) <= tolerance,
    )

    if (existingLine) {
      existingLine.items.push(item)

      existingLine.y =
        existingLine.items.reduce(
          (total, current) =>
            total + current.y,
          0,
        ) / existingLine.items.length
    } else {
      lines.push({
        y: item.y,
        pageWidth: item.pageWidth,
        items: [item],
        text: "",
      })
    }
  }

  return lines
    .map((line) => {
      const orderedItems = line.items.sort(
        (first, second) =>
          first.x - second.x,
      )

      return {
        ...line,
        items: orderedItems,
        text: normalizeText(
          orderedItems
            .map((item) => item.text)
            .join(" "),
        ),
      }
    })
    .sort((first, second) =>
      first.y - second.y,
    )
}

function detectSemester(line: PdfLine) {
  const normalized = normalizeForSearch(
    line.text,
  )

  const match = normalized.match(
    /\bSEMESTRE\s+(\d{1,2})\b/,
  )

  if (!match) {
    return null
  }

  const semester = Number(match[1])

  return Number.isInteger(semester)
    ? semester
    : null
}

function isIgnoredLine(text: string) {
  const normalized = normalizeForSearch(text)

  const ignoredPatterns = [
    /^SEMESTRE\s+\d+/,
    /^SUBTOTAL/,
    /^TOTAL$/,
    /^TEORIA/,
    /^PRACTICA/,
    /^T\/?H$/,
    /^CREDITOS/,
    /^TEPIC/,
    /^DISTRIBUCION DE HORAS/,
    /^LICENCIATURA EN/,
    /^MAPA CURRICULAR/,
    /^INSTITUTO POLITECNICO/,
    /^DIRECCION DE EDUCACION/,
    /^ESCUELA SUPERIOR/,
    /^VIGENCIA/,
  ]

  return ignoredPatterns.some((pattern) =>
    pattern.test(normalized),
  )
}

function cleanCourseName(value: string) {
  return normalizeText(value)
    .replace(/^[-–—•]+\s*/, "")
    .replace(/\s+\*+$/, "")
    .replace(/\s{2,}/g, " ")
    .trim()
}

function getCourseFromLine(
  line: PdfLine,
  semester: number,
): AcademicCourseDraft | null {
  if (
    !line.text ||
    isIgnoredLine(line.text)
  ) {
    return null
  }

  const firstColumnLimit =
    line.pageWidth * 0.57

  const nameItems = line.items.filter(
    (item) =>
      item.x < firstColumnLimit &&
      !isNumeric(item.text),
  )

  const name = cleanCourseName(
    nameItems
      .map((item) => item.text)
      .join(" "),
  )

  if (
    name.length < 4 ||
    isIgnoredLine(name)
  ) {
    return null
  }

  const numericItems = line.items
    .filter(
      (item) =>
        item.x >= firstColumnLimit &&
        isNumeric(item.text),
    )
    .sort((first, second) =>
      first.x - second.x,
    )

  /*
   * Las columnas del mapa son:
   * teoría, práctica, T/H y créditos TEPIC.
   * El último valor numérico corresponde a créditos.
   */
  const creditsValue =
    numericItems.length > 0
      ? parseNumber(
          numericItems[
            numericItems.length - 1
          ].text,
        )
      : null

  if (
    creditsValue === null ||
    creditsValue < 0 ||
    creditsValue > 30
  ) {
    return null
  }

  return {
    temporaryId: createTemporaryId(),
    code: "",
    name,
    semester,
    credits: creditsValue,
  }
}

function detectCourses(
  items: PositionedPdfText[],
) {
  const firstPageItems = items.filter(
    (item) => item.page === 1,
  )

  const lines =
    groupItemsIntoLines(firstPageItems)

  const semesterHeaders = lines
    .map((line, index) => ({
      index,
      semester: detectSemester(line),
    }))
    .filter(
      (
        entry,
      ): entry is {
        index: number
        semester: number
      } => entry.semester !== null,
    )

  const courses: AcademicCourseDraft[] = []

  semesterHeaders.forEach(
    (header, headerIndex) => {
      const nextHeader =
        semesterHeaders[headerIndex + 1]

      const sectionEnd =
        nextHeader?.index ?? lines.length

      const semesterLines = lines.slice(
        header.index + 1,
        sectionEnd,
      )

      for (const line of semesterLines) {
        const course = getCourseFromLine(
          line,
          header.semester,
        )

        if (!course) {
          continue
        }

        const duplicate = courses.some(
          (existingCourse) =>
            existingCourse.semester ===
              course.semester &&
            normalizeForSearch(
              existingCourse.name,
            ) ===
              normalizeForSearch(course.name),
        )

        if (!duplicate) {
          courses.push(course)
        }
      }
    },
  )

  return courses.sort((first, second) => {
    if (
      first.semester !== second.semester
    ) {
      return (
        first.semester -
        second.semester
      )
    }

    return first.name.localeCompare(
      second.name,
      "es",
    )
  })
}

function detectCareer(text: string) {
  const normalized = normalizeText(text)

  const match = normalized.match(
    /LICENCIATURA\s+EN\s+COMERCIO\s+INTERNACIONAL/i,
  )

  return match
    ? "Licenciatura en Comercio Internacional"
    : "Licenciatura"
}

function detectCurriculum(text: string) {
  const match = text.match(
    /PLAN\s*(\d{4})/i,
  )

  return match
    ? `Plan ${match[1]}`
    : ""
}

export function isIpnCurriculum(
  text: string,
) {
  const normalized = normalizeForSearch(text)

  return (
    normalized.includes(
      "INSTITUTO POLITECNICO NACIONAL",
    ) ||
    normalized.includes(
      "ESCUELA SUPERIOR DE COMERCIO Y ADMINISTRACION",
    )
  )
}

export function createIpnAcademicPlanDraft(
  text: string,
  items: PositionedPdfText[],
  file: File,
): AcademicPlanDraft {
  const career = detectCareer(text)
  const curriculum =
    detectCurriculum(text)

  return {
    name:
      curriculum && career
        ? `${career} · ${curriculum}`
        : career ||
          file.name.replace(/\.pdf$/i, ""),
    institution:
      "Instituto Politécnico Nacional",
    career,
    curriculum,
    courses: detectCourses(items),
    sourceFile: file,
    sourceFileName: file.name,
    extractedText: text,
  }
}
