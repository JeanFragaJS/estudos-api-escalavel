const { urlencoded } = require('body-parser')
const express = require('express')
const config= require('config')

const router = require('./routes/fornecedores/fornecedorControllers.js')
const routerV2= require('./routes/fornecedores/fornecedor.V2.Controller')

const NotFound= require('./error/NotFound')
const InvalidField = require('./error/InvalidField.js')
const DataNotProvided = require('./error/DataNotProvided.js')
const UnsupportedValue= require('./error/UnsupportedValue')

const { SerializerError } = require('./serializer')
const acceptFormats= require('./serializer').acceptFormats


//const bodyParser= require('body-parser')
const app = express()

app.use(express.json())
app.use(urlencoded({extended: true}))

app.use((req, res, next)=>{
/*
O middleware no começo da API
consegue verificar pelo cabeçalho Accept, qual o
formato aceito pelo cliente da API, caso não seja aceito,
encerra a requisição evitando o processamento desnecessário
da requisição e também define o cabeçalho Content-Type para
ser usado por um serializador nas requisições. Através do 
serializador, Fernanda consegue centralizar toda a parte de 
tratamento e formatação dos dados que serão enviados na resposta.
*/
    let requiredFormat= req.header('Accept')

    if(requiredFormat === '*/*'){
      requiredFormat= 'application/json'
    }

    if(acceptFormats.indexOf(requiredFormat) === -1){
    /*
    o indexOf vai buscar dentro da lista o indice 
    que se encontra o valor, caso nao encontre ele retorna -1
    */
      res.status(406).end() //status 406 Not Acceptable lista de valores no cabeçalho não aceita. 
      return
    }
    res.setHeader('Content-Type',requiredFormat)
    next()
})

app.use((req, res, next)=>{
  res.set('Access-Control-Allow-Origin', '*')
  next()
})

app.use('/api/v2/fornecedores', routerV2)
app.use('/api/fornecedores', router)

app.use((erro, req, res, next)=>{
 let status= 500
  if(erro instanceof NotFound){
    status= 404
  }
  if(erro instanceof InvalidField || erro instanceof DataNotProvided){
    status= 400
  }
  if(erro instanceof UnsupportedValue){
    status=406
  }

  const serialError= new SerializerError(res.getHeader('Content-Type'))
  res.status(status).send(
    serialError.serialize({
      name:erro.name,
      mensagem:erro.message,
      id:erro.idErro
    })
  )
})

app.listen(config.get('api.port'), ()=>{console.log('api rodando')})