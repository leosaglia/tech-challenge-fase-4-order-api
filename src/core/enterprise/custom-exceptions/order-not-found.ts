export class OrderNotFoundError extends Error {
  constructor(message: string = 'Pedido nao encontrado') {
    super(message)
    this.name = 'OrderNotFoundError'
  }
}
