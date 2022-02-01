class DataNotProvided extends Error{
  constructor() {

    super(`Não foram fornecidos dados para atualizar`)
    this.name= 'Dados não Fornecidos'
    this.idErro= 2
  }
}

module.exports= DataNotProvided