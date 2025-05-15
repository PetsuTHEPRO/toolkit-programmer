export default class Video {
  constructor(id, name, description, link, thumbnailUrl, titulo, apiIdVideo) {
    this.id = id
    this.name = name
    this.description = description
    this.link = link
    this.thumbnailUrl = thumbnailUrl
    this.titulo = titulo
    this.apiIdVideo = apiIdVideo
  }

  toDTO() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      link: this.link,
      thumbnailUrl: this.thumbnailUrl,
      titulo: this.titulo,
      apiIdVideo: this.apiIdVideo
    }
  }
}
