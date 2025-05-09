export class OrderNotFoundError extends Error {
  constructor(message: string = 'Invalid data') {
    super(message)
    this.name = 'OrderNotFoundError'
  }
}
