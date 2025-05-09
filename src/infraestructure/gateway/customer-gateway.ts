import { ICustomerGateway } from '@core/application/interfaces/gateway/customer-gateway-interface'
import { ICustomerDataSource } from '@core/application/interfaces/repository/customer-data-source'
import { Customer } from '@core/enterprise/entities/customer'
import { CustomerMapper } from './mappers/customer-mapper'

export class CustomerGateway implements ICustomerGateway {
  constructor(private customerDataSource: ICustomerDataSource) {}

  async create(customer: Customer): Promise<void> {
    await this.customerDataSource.create(
      CustomerMapper.toCreateCustomerDto(customer),
    )
  }

  async findByDocument(document: string): Promise<Customer | null> {
    const customer = await this.customerDataSource.findByDocument(document)

    if (!customer) {
      return null
    }

    return CustomerMapper.toDomain(customer)
  }

  async findById(customerId: string): Promise<Customer | null> {
    const customer = await this.customerDataSource.findById(customerId)

    if (!customer) {
      return null
    }

    return CustomerMapper.toDomain(customer)
  }
}
