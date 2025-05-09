import { Customer } from '@core/enterprise/entities/customer'
import { Document } from '@core/enterprise/valueObjects/document'
import { CreateCustomerDto } from '@core/application/dtos/create-customer-dto'

interface CustomerProps {
  id: string
  name: string
  document: Document
  email: string
}

export function makeCreateCustomerDto(
  override: Partial<CreateCustomerDto> = {},
): CreateCustomerDto {
  return {
    name: 'John Doe',
    document: '111.444.777-35',
    email: 'john.doe@example.com',
    ...override,
  }
}

export function makeCustomer({
  id = '1',
  name = 'John Doe',
  document = new Document('111.444.777-35'),
  email = 'john.doe@example.com',
}: Partial<CustomerProps> = {}): Customer {
  return new Customer(name, document, email, id)
}
