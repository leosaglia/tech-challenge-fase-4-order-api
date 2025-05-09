export class InvalidOrderError extends Error {
  constructor(message: string = 'Invalid data') {
    super(message)
    this.name = 'InvalidOrderError'
  }
}
