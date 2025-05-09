export class CustomerNotFoundError extends Error {
  constructor(message: string = 'Invalid data') {
    super(message)
    this.name = 'CustomerNotFoundError'
  }
}
