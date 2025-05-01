// Faça agora o DTO para a fonte
// ImageForAI.dto.js
export default function articleIADTO(article) {
  return {
    name: article.name,
    description: article.description,
    pdfFileName: article.pdfFileName
    // ❌ base64 é omitido intencionalmente
  }
}
