export class InvalidCustomerError extends Error {
  constructor(message: string = 'Invalid data') {
    super(message)
    this.name = 'InvalidCustomerError'
  }
}
