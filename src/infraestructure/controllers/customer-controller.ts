import { CreateCustomerUseCase } from '@core/application/useCases/customer/create-customer-use-case'
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
}
