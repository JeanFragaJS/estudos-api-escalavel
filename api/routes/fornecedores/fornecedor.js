const fornecedorTable= require('./fornecedorDAO')
const InvalidField= require('../../error/InvalidField')
const DataNotProvided = require('../../error/DataNotProvided')

class FornecedorData{
  constructor({id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao}){
    this.id= id,
    this.empresa=empresa,
    this.email=email,
    this.categoria=categoria,
    this.dataCriacao=dataCriacao,
    this.dataAtualizacao=dataAtualizacao
  }

  async criation(){
    this.validation()
    const resultado=  await fornecedorTable.insert({
        empresa: this.empresa,
        email:this.email,
        categoria:this.categoria
    })

    this.id= resultado.id
    this.dataCriacao= resultado.dataCriacao
    this.dataAtualizacao= resultado.dataAtualizacao

  }

  async loadDetails(){
    const findDetails= await fornecedorTable.getDetails(this.id)
    this.empresa= findDetails.empresa
    this.email= findDetails.email
    this.categoria= findDetails.categoria
    this.dataCriacao= findDetails.dataCriacao
    this.dataAtualizacao= findDetails.dataAtualizacao
    this.versao= findDetails.versao
  }

  async updateDetails(){
    //verificar se o fornecedor existe na table 
   await fornecedorTable.getDetails(this.id)
   const campos= ['empresa', 'email', 'categoria']
   const updateData={}
   campos.forEach(campo=>{
     const value= this[campo]
     if(typeof value === 'string' && value.length > 0){
       updateData[campo]= value
     }
   })

   if(Object.keys(updateData).length === 0){
      throw new DataNotProvided()
   }

   console.log(updateData)
   await fornecedorTable.editDetails(this.id, updateData)

  }

  remove( ){
    return fornecedorTable.remove(this.id)
  }

  validation(){
    const campos= ['empresa','email','categoria']

    campos.forEach(campo => {
      const value = this[campo]
      if(typeof value !== 'string' || value.length === 0){
        throw new InvalidField(campo)
      }
    })
  }
}

module.exports= FornecedorData