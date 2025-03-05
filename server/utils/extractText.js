import pdfParse from "pdf-parse";

export const extractTextFromFile = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text; // Extracted text from the PDF
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
};
