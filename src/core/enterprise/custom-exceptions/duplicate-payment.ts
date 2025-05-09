export class DuplicatePaymentError extends Error {
  constructor(message: string = 'Invalid data') {
    super(message)
    this.name = 'DuplicatePaymentError'
  }
}
