// Faça agora o DTO para a fonte
// ImageForAI.dto.js
export default function linkIADTO(link) {
  return {
    name: link.name,
    description: link.description
    // ❌ base64 é omitido intencionalmente
  }
}
