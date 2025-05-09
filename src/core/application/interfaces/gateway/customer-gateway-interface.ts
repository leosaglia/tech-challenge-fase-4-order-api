import { Customer } from '@core/enterprise/entities/customer'

export interface ICustomerGateway {
  create(customer: Customer): Promise<void>
  findByDocument(document: string): Promise<Customer | null>
  findById(customerId: string): Promise<Customer | null>
}
