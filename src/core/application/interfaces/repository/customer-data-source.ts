import { CreateCustomerDto } from '@core/application/dtos/create-customer-dto'
import { CustomerDto } from '@core/application/dtos/customer-dto'

export interface ICustomerDataSource {
  create(customer: CreateCustomerDto): Promise<void>
  findByDocument(document: string): Promise<CustomerDto | null>
  findById(customerId: string): Promise<CustomerDto | null>
}
