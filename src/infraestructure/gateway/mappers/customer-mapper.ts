import { CreateCustomerDto } from '@core/application/dtos/create-customer-dto'
import { CustomerDto } from '@core/application/dtos/customer-dto'
import { Customer } from '@core/enterprise/entities/customer'
import { Document } from '@core/enterprise/valueObjects/document'

export class CustomerMapper {
  static toDomain(customerDto: CustomerDto): Customer {
    return new Customer(
      customerDto.name,
      new Document(customerDto.document),
      customerDto.email,
      customerDto.id,
    )
  }

  static toCreateCustomerDto(customer: Customer): CreateCustomerDto {
    return {
      name: customer.getName(),
      document: customer.getDocument(),
      email: customer.getEmail(),
      id: customer.getId(),
    }
  }
}
