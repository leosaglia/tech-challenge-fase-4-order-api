export class CustomerAlreadyExistsError extends Error {
  constructor(message: string = 'Invalid data') {
    super(message)
    this.name = 'CustomerAlreadyExistsError'
  }
}
