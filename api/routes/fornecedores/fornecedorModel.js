const Sequelize= require('sequelize')
const instancia= require('../../database/index.js')

const columns= {
  empresa:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  categoria: {
  type: Sequelize.ENUM('ração', 'brinquedos'),
  allowNull: false
  }
} 
/*
cada chave do objeto vai ser
o nome da column que é o padrao do sequelize
 */

const options= {
    freezeTableName: true,
    tableName: 'fornecedores',
    timestamps: true,// timestamps serve para ativar as marcaçoes de tempo na table
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao',
    version: 'versao'
}

module.exports= instancia.define('fornecedores', columns, options)
/*
 primeiro argumento é nome da table
 segundo argumento as colunas (columns)
 terceiro argumento opçoes(options) 
*/ 