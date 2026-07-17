import {
  createIpnAcademicPlanDraft,
  isIpnCurriculum,
} from "@/lib/curriculum-parsers/ipn-parser"
import type { PositionedPdfText } from "@/lib/pdf"
import type {
  AcademicPlanDraft,
} from "@/types/academic-plan"

interface UniversalParserInput {
  text: string
  items: PositionedPdfText[]
  file: File
  fallback: () => AcademicPlanDraft
}

export function parseCurriculumDocument({
  text,
  items,
  file,
  fallback,
}: UniversalParserInput) {
  if (isIpnCurriculum(text)) {
    console.info(
      "[Retícula] Analizador detectado: IPN",
    )

    return createIpnAcademicPlanDraft(
      text,
      items,
      file,
    )
  }

  console.info(
    "[Retícula] Analizador detectado: genérico/TecNM",
  )

  return fallback()
}
