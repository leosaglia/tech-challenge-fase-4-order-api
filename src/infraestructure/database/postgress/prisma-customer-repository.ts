import { CustomerDto } from '@core/application/dtos/customer-dto'
import { CreateCustomerDto } from '@core/application/dtos/create-customer-dto'
import { PrismaService } from '@infra/frameworks/prisma/prisma.service'
import { PrismaCustomerMapper } from './mappers/prisma-customer-mapper'
import { ICustomerDataSource } from '@core/application/interfaces/repository/customer-data-source'

export default class PrismaCustomerRepository implements ICustomerDataSource {
  constructor(private prisma: PrismaService) {}

  async create(customer: CreateCustomerDto): Promise<void> {
    const data = PrismaCustomerMapper.toPersistence(customer)

    await this.prisma.customer.create({
      data,
    })
  }

  async findByDocument(document: string): Promise<CustomerDto | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { document },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDto(customer)
  }

  async findById(customerId: string): Promise<CustomerDto | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDto(customer)
  }
}
