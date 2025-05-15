export default class Algorithm {
  constructor(id, name, explanation, lang, code) {
    this.id = id
    this.name = name
    this.explanation = explanation
    this.lang = lang
    this.code = code
  }

  toDTO() {
    return {
      id: this.id,
      name: this.name,
      explanation: this.explanation,
      lang: this.lang,
      code: this.code
    }
  }
}
