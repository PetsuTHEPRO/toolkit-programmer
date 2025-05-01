// Faça agora o DTO para a fonte
// ImageForAI.dto.js
export default function fontIADTO(font) {
  return {
    name: font.name,
    family: font.family
    // ❌ base64 é omitido intencionalmente
  }
}
