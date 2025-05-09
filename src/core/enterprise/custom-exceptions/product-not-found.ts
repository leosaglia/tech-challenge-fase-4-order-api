export class ProductNotFoundError extends Error {
  constructor(message: string = 'Produto nao encontrado') {
    super(message)
    this.name = 'ProductNotFoundError'
  }
}
