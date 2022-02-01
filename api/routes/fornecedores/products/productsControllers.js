const router= require('express').Router({mergeParams: true}) 
const TableProduct=  require('./productsDAO')
//const protestsRouter= require('./protests/protestsControllers')
const ProductData= require('./product')
const SerializerProduct= require('../../../serializer').SerializerProduct
/*
 o margeParams: true irá juntar os paramentros 
 do roteador que está a cima com este roteador
*/

router.options('/',(req, res)=>{
  res.set('Access-Control-Allow-Methods', 'GET, POST')
  res.set('Access-Control-Allow-Headers','Content-type')
  res.status(204).end()
})

router.get('/', async (req, res)=>{

  const products= await TableProduct.list(req.fornecedor.id) 

  const serial= new SerializerProduct(res.getHeader('Content-type'))

  res.status(200).send(serial.serialize(products)) 
})

router.post('/', async (req, res, next)=>{

  try {
    const idFornecedor= req.fornecedor.id
    const shape= req.body
    const allData= Object.assign({}, shape, {fornecedor: idFornecedor}) 

    const product=  new ProductData(allData)
    await product.criation()
    const serial= new SerializerProduct(res.getHeader('Content-type'))
    
    res.set('X-Powered-By', 'Gatito')
    res.set('ETag', product.versao)
    
    const timestamp= (new Date(product.dataAtualizacao)).getTime()
    res.set('Last-Modified', timestamp)
    
    res.set('Location', `/api/fornecedores/${product.fornecedor}/products/${product.id}`)
    res.status(201)
    res.send(serial.serialize(product))
    
    }catch(erro){ 
      next(erro)
    }
})

router.options('/:id',(req, res)=>{
  res.set('Access-Control-Allow-Methods', 'GET, HEAD, PUT, DELETE')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  res.status(204).end()
})
router.get('/:id', async (req, res)=>{
try{  
  const data= {
    id: req.params.id,
    fornecedor: req.fornecedor.id
  }
  const product= new ProductData(data)
  await product.loadDetails()
  const serial= new SerializerProduct(res.getHeader('Content-Type'), ['price','stock','fornecedor','dataCriacao', 'dataAtualizacao', 'versao'])
  
  res.set('X-Powered-By', 'Gatito')
  const timestamp= (new Date(product.dataAtualizacao)).getTime()
  res.set('Last-Modified', timestamp)

  res.set('ETag', product.versao)
  res.status(200)
  res.send(serial.serialize(product))

}catch(erro){
  console.log(erro)
}

})

router.head('/:id', async (req, res)=>{
  try{  
    const data= {
      id: req.params.id,
      fornecedor: req.fornecedor.id
    }
    const product= new ProductData(data)
    await product.loadDetails()
    
    res.set('ETag', product.versao)
    res.set('X-Powered-By', 'Gatito')
    
    const timestamp= (new Date(product.dataAtualizacao)).getTime()
    res.set('Last-Modified', timestamp)
  
    res.status(200)
    res.end()
    
  }catch(erro){
    console.log(erro)
  }
  
})

router.put('/:id',async (req, res, next)=>{
  try{
    const data= Object.assign(
      {},
      req.body,
      {
        id:req.params.id,
        fornecedor: req.fornecedor.id
      }
    )
    const product= new ProductData(data)
    await product.updateDetails()
    await product.loadDetails()
    
    res.set('X-Powered-By', 'Gatito')
    res.set('ETag', product.versao)
    const timestamp= (new Date( product.dataAtualizacao)).getTime()
    
    res.set('Last-Modified', timestamp)
    res.status(204).end()

  }catch (erro) {
    next(erro)
  } 

})

router.delete('/:id', async (req, res)=>{
   const data={
     id:req.params.id,
     fornecedor: req.params.fornecedor
   }

   const product= new ProductData(data) 
   await product.remove()
   res.status(204).end()
})

router.options('/:id/diminuir-estoque',(req, res)=>{
  res.set('Access-Control-Allow-Methods', 'POST')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  res.status(204).end()
})

router.post('/:id/diminuir-estoque', async (req, res, next)=>{
  try{
    const product= new ProductData({
      id: req.params.id,
      fornecedor: req.fornecedor.id
    })
    //verificar se o product existe por meio do método loadDetails()
    await product.loadDetails()
    product.stock= product.stock - req.body.quantity
   
    await product.diminuirEstoque()
    await product.loadDetails()
    
    res.set('X-Powered-By', 'Gatito')
    const timesTamp= (new Date(product.dataAtualizacao)).getTime()
    res.set('Last-Modified', timesTamp)
    
    res.set('ETag', product.versao)
    res.status(204).end()

  }catch (erro) {
    next(erro)
  }
})


//router.use('/idProduct/protests', protestsRouter)

module.exports= router