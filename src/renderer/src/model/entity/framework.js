export default class Framework {
  constructor(id, name, description, installation, documentationLink) {
    this.id = id
    this.name = name
    this.description = description
    this.installation = installation
    this.documentationLink = documentationLink
  }

  toDTO() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      installation: this.installation,
      documentationLink: this.documentationLink
    }
  }
}
