import { Customer } from '@core/enterprise/entities/customer'
import { Document } from '@core/enterprise/valueObjects/document'
import { CustomerNotFoundError } from '@core/enterprise/custom-exceptions/customer-not-found'
import { ICustomerGateway } from '@core/application/interfaces/gateway/customer-gateway-interface'

type IdentifyCustomerByDocumentUseCaseResponse = {
  customer: Customer
}

export class IdentifyCustomerByDocumentUseCase {
  constructor(private customerGateway: ICustomerGateway) {}

  async execute(
    document: string,
  ): Promise<IdentifyCustomerByDocumentUseCaseResponse> {
    const documentValue = new Document(document).getValue()

    const customer = await this.customerGateway.findByDocument(documentValue)

    if (!customer) {
      throw new CustomerNotFoundError('Customer not created')
    }

    return { customer }
  }
}
