export default class Api {
  constructor(id, name, description, key) {
    this.id = id
    this.name = name
    this.description = description
    this.key = key
  }

  toDTO() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      key: this.key
    }
  }
}
