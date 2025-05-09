import { InvalidCategoryError } from '@core/enterprise/custom-exceptions/invalid-category'

export class Category {
  private readonly validCategories = ['lanche', 'bebida', 'acompanhamento']

  constructor(private readonly value: string) {
    const lowerCaseValue = value.toLowerCase()
    if (!this.isValid(lowerCaseValue)) {
      throw new InvalidCategoryError('Invalid category.')
    }
    this.value = lowerCaseValue
  }

  private isValid(value: string): boolean {
    return this.validCategories.includes(value)
  }

  getValue(): string {
    return this.value
  }
}
