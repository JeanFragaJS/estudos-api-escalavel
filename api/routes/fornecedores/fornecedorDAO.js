const ModelFornecedor = require('./fornecedorModel')
const NotFound= require('../../error/NotFound.js')
module.exports= {

  list(){
   return  ModelFornecedor.findAll({ raw:true} )//limpa deixando o objeto js puro

  },

  insert(fornecedor){
    return ModelFornecedor.create(fornecedor)//method create é do sequelize
  },

  async getDetails(id){
    const found=  await ModelFornecedor.findOne({
      where:{id:id}
    })
    if(!found){
      throw new NotFound('Fornecedor')
    }
    return found
  },

  editDetails(id, updateData){
    return ModelFornecedor.update(updateData, {where:{id:id}})

  },
  remove(id){
    return ModelFornecedor.destroy({
      where: {id:id }
    })
  }
}