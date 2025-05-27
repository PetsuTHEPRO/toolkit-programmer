export default class Link {
  constructor(id, name, description, link) {
    this.id = id
    this.name = name
    this.description = description
    this.link = link
  }

  toDTO() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      link: this.link
    }
  }
}
