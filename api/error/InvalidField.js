class InvalidField extends Error{
  constructor(field){
    const mensagem= `O ${field} está inválido`
    super(mensagem)
    this.name= 'Campo inválido'
    this.idErro= 1
  }
}

module.exports= InvalidField