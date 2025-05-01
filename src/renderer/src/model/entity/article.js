export default class Article {
  constructor(id, name, description, pdfFileName, pdfSize, path) {
    ;(this.id = id),
      (this.name = name),
      (this.description = description),
      (this.pdfFileName = pdfFileName),
      (this.pdfSize = pdfSize),
      (this.path = path)
  }

  toDTO() {
    return {
      id: this.idArticle,
      name: this.name,
      description: this.description,
      pdfFileName: this.pdfFileName,
      pdfSize: this.pdfSize,
      path: this.path
    }
  }
}
