class UnsupportedValue extends Error{
  constructor(contentType) {

    super(`Tipagem de conteúde ${contentType} não é suportada`)
    this.name= 'Tipagem não suportada'
    this.idErro= 3
  }
}

module.exports= UnsupportedValue