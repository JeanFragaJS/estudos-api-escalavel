const router= require('express').Router()
const FornecedorTable= require('./fornecedorDAO')
const SerializerFornecedor= require('../../serializer').SerializerFornecedor

router.options('/', (req, res)=>{
  res.set('Access-Control-Allow-Method', 'GET')
  res.set('Access-Control-Allow-Headrs', 'Content-Type')
  res.status(204)
  res.end()
})

router.get('/', async (req,res)=>{
  const results= await FornecedorTable.list()
  const serial= new SerializerFornecedor(res.getHeader('Content-Type'))
  res.status(200)
  res.send(serial.serialize(results))
})

 module.exports= router