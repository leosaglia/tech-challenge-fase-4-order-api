import { Customer } from '@core/enterprise/entities/customer'
import { Document } from '@core/enterprise/valueObjects/document'
import { CreateCustomerDto } from '@core/application/dtos/create-customer-dto'
import { ICustomerGateway } from '@core/application/interfaces/gateway/customer-gateway-interface'
import { CustomerAlreadyExistsError } from '@core/enterprise/custom-exceptions/customer-already-exists'

type CreateCustomerUseCaseResponse = {
  customer: Customer
}

export class CreateCustomerUseCase {
  constructor(private readonly customerGateway: ICustomerGateway) {}

  async execute({
    document,
    name,
    email,
    id,
  }: CreateCustomerDto): Promise<CreateCustomerUseCaseResponse> {
    const customer = new Customer(name, new Document(document), email, id)

    const customerFound = await this.customerGateway.findByDocument(
      customer.getDocument(),
    )

    if (customerFound) {
      throw new CustomerAlreadyExistsError('Customer already exists.')
    }

    this.customerGateway.create(customer)

    return { customer }
  }
}
