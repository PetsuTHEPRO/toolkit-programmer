// Faça agora o DTO para a fonte
// ImageForAI.dto.js
export default function iconIADTO(icon) {
  return {
    name: icon.name,
    usage: icon.usage,
    library: icon.library
    // ❌ base64 é omitido intencionalmente
  }
}
