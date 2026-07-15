import {
  createAcademicPlanDraft,
} from "@/lib/curriculum-parser"
import { extractPdfText } from "@/lib/pdf"

export async function testCurriculumPdf(
  file: File,
) {
  const text = await extractPdfText(file)
  const draft = createAcademicPlanDraft(text, file)

  console.info("Texto extraído:", text)
  console.info("Borrador generado:", draft)

  return draft
}
