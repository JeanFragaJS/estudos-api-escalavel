const instancia= require('../../../database/index')
const Sequelize= require('sequelize')

const columns ={
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },

  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },

  stock: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  fornecedor: {
    type:Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: require('../fornecedorModel'),
      key:'id'
    } 
  }

}

const options = {
  freezeTableName:true,
  tableName: 'products',
  timestamp: true,
  createdAt: 'dataCriacao',
  updatedAt: 'dataAtualizacao',
  version: 'versao'
}

module.exports= instancia.define('products', columns, options)