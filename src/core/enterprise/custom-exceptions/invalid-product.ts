export class InvalidProductError extends Error {
  constructor(message: string = 'Invalid data') {
    super(message)
    this.name = 'InvalidProductError'
  }
}
