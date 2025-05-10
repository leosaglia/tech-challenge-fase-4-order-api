import { describe, it, expect } from 'vitest'
import { PrismaCustomerMapper } from './prisma-customer-mapper'
import { Customer as PrismaCustomer, Prisma } from '@prisma/client'
import { CreateCustomerDto } from '@core/application/dtos/create-customer-dto'

describe('PrismaCustomerMapper', () => {
  it('should map PrismaCustomer to CustomerDto correctly', () => {
    const raw: PrismaCustomer = {
      id: 'cust-1',
      name: 'Alice',
      email: 'alice@example.com',
      document: '123.456.789-00',
    }

    const dto = PrismaCustomerMapper.toDto(raw)

    expect(dto).toEqual({
      id: 'cust-1',
      name: 'Alice',
      email: 'alice@example.com',
      document: '123.456.789-00',
    })
  })

  it('should map CreateCustomerDto to Prisma.CustomerUncheckedCreateInput correctly', () => {
    const createDto: CreateCustomerDto = {
      id: 'cust-2',
      name: 'Bob',
      email: 'bob@example.com',
      document: '987.654.321-00',
    }

    const persistence: Prisma.CustomerUncheckedCreateInput =
      PrismaCustomerMapper.toPersistence(createDto)

    expect(persistence).toEqual({
      id: 'cust-2',
      name: 'Bob',
      email: 'bob@example.com',
      document: '987.654.321-00',
    })
  })
})
