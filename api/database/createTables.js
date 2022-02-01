const Models = [ 
  require('../routes/fornecedores/fornecedorModel'),
  require('.././routes/fornecedores/products/productsModel')
]

async function createTables(){
  for(let count= 0; count < Models.length; count++){
    const model= Models[count]
   await model.sync()
  }
}
 createTables()


//ModelTableFornecedor.sync().then(()=>console.log('table criada com sucesso')).catch(console.log)