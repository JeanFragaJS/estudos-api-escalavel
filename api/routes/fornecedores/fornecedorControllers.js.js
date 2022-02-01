const router = require('express').Router()
const FornecedorTable =  require('./fornecedorDAO')
const FornecedorData= require('./fornecedor')
const SerializerFornecedor=  require('../../serializer').SerializerFornecedor
const productRouter=  require('./products/productsControllers')

router.options('/',(req, res)=>{
  res.set('Access-Control-Allow-Methods', 'GET, POST')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  res.status(204).end()
})

router.get('/', async (req, res)=>{
    const results =  await FornecedorTable.list()

    const serial= new SerializerFornecedor(res.getHeader('Content-Type'), ['empresa'])
    
    res.status(200).send(
      serial.serialize(results)
    )
})

router.post('/',async (req, res, next)=>{
 try {
    const data=  req.body
    const fornecedor= new FornecedorData(data)

    await fornecedor.criation()
    const serial= new SerializerFornecedor(res.getHeader('Content-Type'),['empresa'])
    res.status(201).send(serial.serialize(fornecedor))

  } catch(erro){
    next(erro)
  }
})

router.options('/:idFornecedor',(req, res)=>{
  res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  res.status(204).end()
})

router.get('/:idFornecedor', async (req, res, next)=>{

  try{
    const id= req.params.idFornecedor
    const fornecedor=  new FornecedorData({id:id})

    await fornecedor.loadDetails()
    const serial= new SerializerFornecedor(res.getHeader('Content-Type'),
    ['empresa','email', 'dataCriacao', 'dataAtualizacao', 'versao']// no get id ele deverá trazer as infos completas do fornecedor
    )
    res.status(200).send(serial.serialize(fornecedor)) 

  } catch(erro/* nome da variavel que vai representar o erro */ ){
      next(erro)
    }

})

router.put('/:idFornecedor',async (req, res, next)=>{
  try {
    const id= req.params.idFornecedor
    const dataBody= req.body
    const allData= Object.assign({/*objeto de base*/},dataBody, {id: id})     //object.assing junta dois objetos

    const fornecedor= new FornecedorData(allData)
    await fornecedor.updateDetails()

    res.status(204).end()
  } catch(erro){
    next(erro)
  }

})

router.delete('/:idFornecedor', async (req, res, next)=>{

  try {
    const id= req.params.idFornecedor
    const fornecedor=  new FornecedorData({id:id})
    await fornecedor.loadDetails()
    await fornecedor.remove()
    res.status(204).end()
  } catch(erro) {
   next(erro)
  }
})

const checkFornecedor= async (req, res, next)=>{
  try{
    const id= req.params.idFornecedor
    const fornecedor= new FornecedorData({id:id})

    await fornecedor.loadDetails()
    req.fornecedor= fornecedor
    next()
  }catch (erro) {
    next(erro)
  }
}
router.use('/:idFornecedor/products',checkFornecedor,  productRouter)



module.exports = router