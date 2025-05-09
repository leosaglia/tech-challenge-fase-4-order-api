export class InvalidCategoryError extends Error {
  constructor(message: string = 'Invalid data') {
    super(message)
    this.name = 'InvalidCategoryError'
  }
}
