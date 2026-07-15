import {
  GlobalWorkerOptions,
  Util,
  getDocument,
} from "pdfjs-dist/legacy/build/pdf.mjs"
import pdfWorkerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url"

GlobalWorkerOptions.workerSrc = pdfWorkerUrl

export interface PositionedPdfText {
  text: string
  x: number
  y: number
  width: number
  height: number
  page: number
  pageWidth: number
  pageHeight: number
}

export interface ExtractedPdf {
  text: string
  items: PositionedPdfText[]
}

export async function extractPdfLayout(
  file: File,
): Promise<ExtractedPdf> {
  const arrayBuffer = await file.arrayBuffer()

  const pdfDocument = await getDocument({
    data: new Uint8Array(arrayBuffer),
    disableStream: true,
    disableAutoFetch: true,
  }).promise

  const allItems: PositionedPdfText[] = []
  const pageTexts: string[] = []

  for (
    let pageNumber = 1;
    pageNumber <= pdfDocument.numPages;
    pageNumber += 1
  ) {
    const page = await pdfDocument.getPage(pageNumber)
    const viewport = page.getViewport({
      scale: 1,
    })
    const content = await page.getTextContent()

    const pageItems: PositionedPdfText[] = []

    for (const item of content.items) {
      if (!("str" in item)) {
        continue
      }

      const text = item.str.trim()

      if (!text) {
        continue
      }

      const transformed = Util.transform(
        viewport.transform,
        item.transform,
      )

      pageItems.push({
        text,
        x: transformed[4],
        y: transformed[5],
        width: Math.abs(item.width),
        height: Math.abs(item.height),
        page: pageNumber,
        pageWidth: viewport.width,
        pageHeight: viewport.height,
      })
    }

    pageItems.sort((a, b) => {
      const verticalDifference = a.y - b.y

      if (Math.abs(verticalDifference) > 2) {
        return verticalDifference
      }

      return a.x - b.x
    })

    pageTexts.push(
      pageItems.map((item) => item.text).join(" "),
    )

    allItems.push(...pageItems)
  }

  return {
    text: pageTexts.join("\n"),
    items: allItems,
  }
}

export async function extractPdfText(
  file: File,
): Promise<string> {
  const result = await extractPdfLayout(file)

  return result.text
}
