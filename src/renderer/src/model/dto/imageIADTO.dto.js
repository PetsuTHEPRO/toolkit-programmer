// Faça agora o DTO para a fonte
// ImageForAI.dto.js
export default function imageIADTO(image) {
  return {
    name: image.name,
    description: image.description,
    width: image.width,
    height: image.height,
    size: image.size,
    format: image.format,
    // ❌ base64 é omitido intencionalmente
  }
}
