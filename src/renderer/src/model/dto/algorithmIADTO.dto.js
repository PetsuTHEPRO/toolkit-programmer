// Faça agora o DTO para a fonte
// ImageForAI.dto.js
export default function algorithmIADTO(algorithm) {
  return {
    name: algorithm.name,
    explanation: algorithm.explanation,
    lang: algorithm.lang
    // ❌ base64 é omitido intencionalmente
  }
}
