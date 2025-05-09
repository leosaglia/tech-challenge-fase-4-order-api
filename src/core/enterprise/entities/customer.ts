import { Document } from '@core/enterprise/valueObjects/document'
import { UniqueEntityId } from '@core/enterprise/valueObjects/unique-entity-id'
import { InvalidCustomerError } from '@core/enterprise/custom-exceptions/invalid-customer'

export class Customer {
  id: UniqueEntityId

  constructor(
    private name: string,
    private document: Document,
    private email: string,
    id?: string,
  ) {
    this.validateName(name)
    this.validateEmail(email)
    this.id = new UniqueEntityId(id)
  }

  public getId(): string {
    return this.id.getValue()
  }

  public getName(): string {
    return this.name
  }

  public getDocument(): string {
    return this.document.getValue()
  }

  public getEmail(): string {
    return this.email
  }

  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new InvalidCustomerError('Invalid name.')
    }
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new InvalidCustomerError('Invalid email.')
    }
  }
}
