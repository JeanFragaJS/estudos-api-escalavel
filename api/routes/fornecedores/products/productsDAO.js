const ModelProducts=  require('./productsModel')
const instanciaSequelize= require('../../../database/index')
const NotFound= require('../../../error/NotFound')


module.exports={

  list(idFornecedor){
    return ModelProducts.findAll({
      where:{
        fornecedor:idFornecedor
      },
      raw:true
    })
  },

  insert(product){
    return ModelProducts.create(product)
  },

  getDetails (id, idFornecedor) {
      const foundObject=  ModelProducts.findOne({
        where:{
          id:id,
          fornecedor:idFornecedor
        },
        raw: true // para retornar um objeto sem os metodos do sequelize, cru. 
      })

      if (!foundObject) {
        return new NotFound('Fornecedor')
      }
    return foundObject  
  },

  editDetails (productData, updatedData) {
      return ModelProducts.update(
        updatedData,
        {
          where: productData
        })
  },

  remove (idProduct,idFornecedor) {
    return ModelProducts.destroy({
      where:{
        id:idProduct,
        fornecedor:idFornecedor
      }
    })

  },

  subtrair (idProduct, idFornecedor, field, quantity){
    return instanciaSequelize.transaction(async transacao =>{
      const product= await ModelProducts.findOne({
        where:{
          id:idProduct,
          fornecedor: idFornecedor
        }

      })
      product[field]= quantity

      await product.save()

      return product
    })
  }
  
}