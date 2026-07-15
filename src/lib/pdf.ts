import {
  GlobalWorkerOptions,
  getDocument,
} from "pdfjs-dist"
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url"

GlobalWorkerOptions.workerSrc = pdfWorkerUrl

export async function extractPdfText(
  file: File,
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()

  const document = await getDocument({
    data: arrayBuffer,
  }).promise

  const pages: string[] = []

  for (
    let pageNumber = 1;
    pageNumber <= document.numPages;
    pageNumber += 1
  ) {
    const page = await document.getPage(pageNumber)
    const content = await page.getTextContent()

    const lines = content.items
      .map((item) => {
        if ("str" in item) {
          return item.str
        }

        return ""
      })
      .filter(Boolean)
      .join(" ")

    pages.push(lines)
  }

  return pages.join("\n")
}
