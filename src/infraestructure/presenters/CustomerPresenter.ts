import { Customer } from '@core/enterprise/entities/customer'

export class CustomerPresenter {
  private readonly id: string

  private readonly name: string

  private readonly document: string

  private readonly email: string

  constructor(id: string, name: string, document: string, email: string) {
    this.id = id
    this.name = name
    this.document = document
    this.email = email
  }

  static present(customer: Customer): CustomerPresenter {
    return new CustomerPresenter(
      customer.getId(),
      customer.getName(),
      customer.getDocument(),
      customer.getEmail(),
    )
  }
}
