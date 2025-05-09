import { Prisma, Customer as PrismaCustomer } from '@prisma/client'
import { CustomerDto } from '@core/application/dtos/customer-dto'
import { CreateCustomerDto } from '@core/application/dtos/create-customer-dto'

export class PrismaCustomerMapper {
  static toDto(raw: PrismaCustomer): CustomerDto {
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      document: raw.document,
    }
  }

  static toPersistence(
    customer: CreateCustomerDto,
  ): Prisma.CustomerUncheckedCreateInput {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      document: customer.document,
    }
  }
}
