export class VideoDTO {
  construtor(id, name, description, link, thumbnailUrl, titulo) {
    ;(this.id = id),
      (this.name = name),
      (this.description = description),
      (this.link = link),
      (this.thumbnailUrl = thumbnailUrl),
      (this.titulo = titulo)
  }
}
