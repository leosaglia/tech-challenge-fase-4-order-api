export class InvalidDocumentError extends Error {
  constructor(message: string = 'Invalid data') {
    super(message)
    this.name = 'InvalidDocumentError'
  }
}
