
/* NotFound extends pega as propriedades de Error*/
class NotFound extends Error{
  constructor(name) {
    /*super() é usada para acessar a class pai de uma class
      Aqui no caso a class pai é o Error
    */
   super(`${name} não encontrado`)
   this.name= 'Não encontrado'
   this.idErro= 0
  }
}

module.exports= NotFound