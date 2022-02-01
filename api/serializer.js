const UnsupportedValue= require('./error/UnsupportedValue')
const jsontoxml= require('jsontoxml')

class Serializer{
  json(data){
   return JSON.stringify(data)
  }

  xml(data){
    let tag= this.tagSingular

    if( Array.isArray(data)){
        tag= this.tagPlural
        data= data.map(item=>{
          return {
            [this.tagSingular]:item
          }
        })
    }

    return jsontoxml({ 
      [tag]: data //thi.tag , toda class que tiver a variavel tag, terá o nome para virar o nome da chave
    })

  }

  serialize(data){
    const dadosFiltrados= this.filter(data)

    if(this.contentType === 'application/json') {
      return this.json(dadosFiltrados)
    }

    if(this.contentType === 'application/xml'){
      return this.xml(dadosFiltrados)
    }

    throw new UnsupportedValue()

  }

  objectFilter (data) {
    const newObject = {}
    
    this.publicField.forEach((field)=>{

      if(data.hasOwnProperty(field)) {
        newObject[field]= data[field]
      /*O hasOwnProperty() retorna um boolean t/f verificando 
      se a propriedade está definida no proprio objeto
      ex:
      o = new Object();
      o.hasOwnProperty('prop'); // retorna false
      o.prop = 'existe';
      o.hasOwnProperty('prop'); // retorna true

      ATENÇÃO
      retorna true mesmo se o valor 
      da propridade em questão é null ou undefined
       */
      }
      
    })

    return newObject
  }

  filter(data){
    /*Array.isArray() verifica se é um array e retorna T/F*/
    if(Array.isArray(data)){
      data= data.map((item)=>{
          return this.objectFilter(item)
      })
    }else {
      data= this.objectFilter(data)
    }

    return data
  }

}

class SerializerFornecedor extends Serializer{
  constructor(contentType, extraFields){
    super()
    this.contentType= contentType
    this.publicField= ['id','categoria'].concat(extraFields || [])
    this.tagSingular= 'fornecedor'
    this.tagPlural= 'fornecedores'
  }
}

class SerializerProduct extends Serializer{
  constructor(contentType, extraFields){
    super()
    this.contentType= contentType
    this.publicField= ['id', 'title'].concat(extraFields || [])
    this.tagPlural= 'Products'
    this.tagSingular= 'Product'
  }
}

class SerializerError extends Serializer{
  constructor(contentType, extraFields){
    super()
    this.contentType= contentType
    this.publicField= ['name','mensagem','id'].concat(extraFields || [] )
    this.tagSingular= 'erro'
    this.tagPlural= 'erros'
    //o array vazio é para evitar erros caso nao retorne nada no extraFields
  }
}

module.exports={
  Serializer:Serializer,
  SerializerFornecedor:SerializerFornecedor,
  SerializerError:SerializerError,
  SerializerProduct:SerializerProduct,
  acceptFormats: ['application/json', 'application/xml']
}