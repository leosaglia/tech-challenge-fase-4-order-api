import { describe, it, expect, beforeEach, vi } from 'vitest'
import PrismaCustomerRepository from './prisma-customer-repository'
import { PrismaCustomerMapper } from './mappers/prisma-customer-mapper'
import { CreateCustomerDto } from '@core/application/dtos/create-customer-dto'
import { CustomerDto } from '@core/application/dtos/customer-dto'

vi.mock('./mappers/prisma-customer-mapper', () => ({
  PrismaCustomerMapper: {
    toPersistence: vi.fn(),
    toDto: vi.fn(),
  },
}))

describe('PrismaCustomerRepository', () => {
  let prisma: any
  let repository: PrismaCustomerRepository

  beforeEach(() => {
    prisma = {
      customer: {
        create: vi.fn(),
        findUnique: vi.fn(),
      },
    }
    repository = new PrismaCustomerRepository(prisma)
    vi.clearAllMocks()
  })

  it('should call prisma.customer.create with mapped data', async () => {
    const dto: CreateCustomerDto = {
      name: 'John',
      document: '111',
      email: 'john@example.com',
    }
    const mapped = { name: 'John', document: '111', email: 'john@example.com' }
    ;(PrismaCustomerMapper.toPersistence as any).mockReturnValue(mapped)
    prisma.customer.create.mockResolvedValue(undefined)

    await repository.create(dto)

    expect(PrismaCustomerMapper.toPersistence).toHaveBeenCalledWith(dto)
    expect(prisma.customer.create).toHaveBeenCalledWith({ data: mapped })
  })

  it('should return customer dto when found by document', async () => {
    const dbCustomer = {
      id: '1',
      name: 'John',
      document: '111',
      email: 'john@example.com',
    }
    const dto: CustomerDto = {
      id: '1',
      name: 'John',
      document: '111',
      email: 'john@example.com',
    }
    prisma.customer.findUnique.mockResolvedValue(dbCustomer)
    ;(PrismaCustomerMapper.toDto as any).mockReturnValue(dto)

    const result = await repository.findByDocument('111')

    expect(prisma.customer.findUnique).toHaveBeenCalledWith({
      where: { document: '111' },
    })
    expect(PrismaCustomerMapper.toDto).toHaveBeenCalledWith(dbCustomer)
    expect(result).toBe(dto)
  })

  it('should return null if customer not found by document', async () => {
    prisma.customer.findUnique.mockResolvedValue(null)
    const result = await repository.findByDocument('notfound')
    expect(result).toBeNull()
    expect(PrismaCustomerMapper.toDto).not.toHaveBeenCalled()
  })

  it('should return customer dto when found by id', async () => {
    const dbCustomer = {
      id: '1',
      name: 'John',
      document: '111',
      email: 'john@example.com',
    }
    const dto: CustomerDto = {
      id: '1',
      name: 'John',
      document: '111',
      email: 'john@example.com',
    }
    prisma.customer.findUnique.mockResolvedValue(dbCustomer)
    ;(PrismaCustomerMapper.toDto as any).mockReturnValue(dto)

    const result = await repository.findById('1')

    expect(prisma.customer.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    })
    expect(PrismaCustomerMapper.toDto).toHaveBeenCalledWith(dbCustomer)
    expect(result).toBe(dto)
  })

  it('should return null if customer not found by id', async () => {
    prisma.customer.findUnique.mockResolvedValue(null)
    const result = await repository.findById('notfound')
    expect(result).toBeNull()
    expect(PrismaCustomerMapper.toDto).not.toHaveBeenCalled()
  })
})
