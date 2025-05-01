// Faça uma classe em javascript para representar uma fonte
import { FonteDTO } from '../dto/fonteDTO'

export class Fonte {
  constructor(id, nome, fontFamily, linkImport, imagemRepresentativa) {
    this.id = id
    this.nome = nome
    this.fontFamily = fontFamily
    this.linkImport = linkImport
    this.imagemRepresentativa = imagemRepresentativa
  }

  toDTO() {
    return new FonteDTO(this.nome, this.fontFamily, this.linkImport, this.imagemRepresentativa)
  }
}
