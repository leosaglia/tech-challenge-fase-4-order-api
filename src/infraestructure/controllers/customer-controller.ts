import { IdentifyCustomerByDocumentUseCase } from '@core/application/useCases/costumer/identify-customer-by-document-use-case'
import { CreateCustomerUseCase } from '@core/application/useCases/costumer/create-customer-use-case'
import { CreateCustomerDto } from '@core/application/dtos/create-customer-dto'
import { ICustomerDataSource } from '@core/application/interfaces/repository/customer-data-source'
import { CustomerGateway } from '@infra/gateway/customer-gateway'
import { CustomerPresenter } from '@infra/presenters/CustomerPresenter'

export class CustomerController {
  constructor(private readonly customerDataSource: ICustomerDataSource) {}

  async createCustomer(
    customer: CreateCustomerDto,
  ): Promise<CustomerPresenter> {
    const customerGateway = new CustomerGateway(this.customerDataSource)
    const createCustomerUseCase = new CreateCustomerUseCase(customerGateway)

    const { customer: createdCustomer } =
      await createCustomerUseCase.execute(customer)

    return CustomerPresenter.present(createdCustomer)
  }

  async findCustomerByDocument(document: string): Promise<CustomerPresenter> {
    const customerGateway = new CustomerGateway(this.customerDataSource)
    const identifyCustomerByDocumentUseCase =
      new IdentifyCustomerByDocumentUseCase(customerGateway)

    const { customer } =
      await identifyCustomerByDocumentUseCase.execute(document)

    return CustomerPresenter.present(customer)
  }
}
