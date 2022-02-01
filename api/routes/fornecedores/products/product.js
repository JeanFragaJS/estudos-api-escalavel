const productTable= require('./productsDAO')
const InvalidField= require('../../../error/InvalidField')

class ProductData{
  constructor({id, title, price, stock, fornecedor, dataCriacao, dataAtualizacao, versao}){
    this.id= id,
    this.title= title,
    this.price= price,
    this.stock= stock,
    this.fornecedor= fornecedor,
    this.dataCriacao= dataCriacao,
    this.dataAtualizacao= dataAtualizacao,
    this.versao= versao
  }

  validation () {
    if(typeof this.title !== 'string' || this.title.length === 0) {
      throw new InvalidField('title')
    }

    if (typeof this.price !== 'number' || this.price === 0) {
      throw  new InvalidField('price')
    }
  }

  async criation () {
    this.validation()
    const results= await productTable.insert({
        title: this.title,
        price: this.price,
        stock: this.stock,
        fornecedor: this.fornecedor
    })
        this.id= results.id
        this.dataCriacao= results.dataCriacao
        this.dataAtualizacao= results.dataAtualizacao
        this.versao= results.versao
    }

   async loadDetails () {
      const found= await productTable.getDetails(this.id, this.fornecedor)
      this.title= found.title
      this.price= found.price
      this.stock= found.stock
      this.dataCriacao=  found.dataCriacao
      this.dataAtualizacao= found.dataAtualizacao
      this.versao= found.versao
    }

    async updateDetails () {
      const updatedData = {}

      if(typeof this.title === 'string' && this.title.length > 0) {
        updatedData.title= this.title
      }

      if(typeof this.price === 'number' && this.price > 0) {
        updatedData.price= this.price
      }

      if(typeof this.stock === 'number') {
        updatedData.stock= this.stock
      }

      if(Object.keys(updatedData).length === 0){
        throw new Error('Não foram fornecidos dados para a atualização')
      }

      return productTable.editDetails(
        {
          id: this.id,
          fornecedor: this.fornecedor
        },
        updatedData
      )

    }

    remove () {
      return productTable.remove(this.id, this.fornecedor)
    }


    diminuirEstoque (){
      return productTable.subtrair(
        this.id,
        this.fornecedor,
        'stock',
        this.stock

      )
    }

  }


  module.exports= ProductData