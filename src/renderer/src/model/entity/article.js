export default class Article {
  constructor(id, name, description, path, pdfFilename, pdfSize) {
    ;(this.id = id),
      (this.name = name),
      (this.description = description),
      (this.path = path),
      (this.pdfFilename = pdfFilename),
      (this.pdfSize = pdfSize)
  }

  toDTO() {
    return {
      id: this.idArticle,
      name: this.name,
      description: this.description,
      pdfFilename: this.pdfFilename,
      pdfSize: this.pdfSize,
      path: this.path
    }
  }
}
