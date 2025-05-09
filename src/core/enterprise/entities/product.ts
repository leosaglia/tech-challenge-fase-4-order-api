import { Decimal } from 'decimal.js'

import { Category } from '@core/enterprise/valueObjects/category'
import { UniqueEntityId } from '@core/enterprise/valueObjects/unique-entity-id'
import { InvalidProductError } from '@core/enterprise/custom-exceptions/invalid-product'

export class Product {
  private id: UniqueEntityId

  constructor(
    private name: string,
    private price: Decimal,
    private description: string,
    private category: Category,
    id?: string,
  ) {
    this.validateName(name)
    this.validatePrice(price)
    this.validateDescription(description)
    this.id = new UniqueEntityId(id)
  }

  public getId(): string {
    return this.id.getValue()
  }

  public getName(): string {
    return this.name
  }

  public getPrice(): Decimal {
    return this.price
  }

  public getDescription(): string {
    return this.description
  }

  public getCategory(): string {
    return this.category.getValue()
  }

  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new InvalidProductError('Invalid name.')
    }
  }

  private validatePrice(price: Decimal): void {
    if (price.isNaN() || price.isNegative()) {
      throw new InvalidProductError('Invalid price.')
    }
  }

  private validateDescription(description: string): void {
    if (!description || description.trim().length < 10) {
      throw new InvalidProductError('Invalid description.')
    }
  }
}
