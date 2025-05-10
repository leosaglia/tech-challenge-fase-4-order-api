import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PrismaProductRepository } from './prisma-product-repository'
import { PrismaProductMapper } from './mappers/prisma-product-mapper'
import { ProductDto } from '@core/application/dtos/product-dto'
import Decimal from 'decimal.js'

vi.mock('./mappers/prisma-product-mapper', () => ({
  PrismaProductMapper: {
    toPersistence: vi.fn(),
    toPersistenceUpdate: vi.fn(),
    toDto: vi.fn(),
  },
}))

describe('PrismaProductRepository', () => {
  let prisma: any
  let repository: PrismaProductRepository

  beforeEach(() => {
    prisma = {
      product: {
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
      },
    }
    repository = new PrismaProductRepository(prisma)
    vi.clearAllMocks()
  })

  it('should call prisma.product.create with mapped data', async () => {
    const dto: ProductDto = {
      id: '1',
      name: 'Test',
      description: 'desc',
      category: 'lanche',
      price: new Decimal(10),
    }
    const mapped = {
      name: 'Test',
      description: 'desc',
      category: 'lanche',
      price: new Decimal(10),
    }
    ;(PrismaProductMapper.toPersistence as any).mockReturnValue(mapped)
    prisma.product.create.mockResolvedValue(undefined)

    await repository.create(dto)

    expect(PrismaProductMapper.toPersistence).toHaveBeenCalledWith(dto)
    expect(prisma.product.create).toHaveBeenCalledWith({ data: mapped })
  })

  it('should call prisma.product.update with mapped data', async () => {
    const dto: ProductDto = {
      id: '1',
      name: 'Test',
      description: 'desc',
      category: 'lanche',
      price: new Decimal(10),
    }
    const mapped = {
      name: 'Test',
      description: 'desc',
      category: 'lanche',
      price: new Decimal(10),
    }
    ;(PrismaProductMapper.toPersistenceUpdate as any).mockReturnValue(mapped)
    prisma.product.update.mockResolvedValue(undefined)

    await repository.edit(dto)

    expect(PrismaProductMapper.toPersistenceUpdate).toHaveBeenCalledWith(dto)
    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: dto.id },
      data: mapped,
    })
  })

  it('should call prisma.product.delete with correct id', async () => {
    prisma.product.delete.mockResolvedValue(undefined)
    await repository.delete('1')
    expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: '1' } })
  })

  it('should return product dto when found by id', async () => {
    const dbProduct = {
      id: '1',
      name: 'Test',
      description: 'desc',
      category: 'lanche',
      price: new Decimal(10),
    }
    const dto: ProductDto = {
      id: '1',
      name: 'Test',
      description: 'desc',
      category: 'lanche',
      price: new Decimal(10),
    }
    prisma.product.findUnique.mockResolvedValue(dbProduct)
    ;(PrismaProductMapper.toDto as any).mockReturnValue(dto)

    const result = await repository.findById('1')

    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    })
    expect(PrismaProductMapper.toDto).toHaveBeenCalledWith(dbProduct)
    expect(result).toBe(dto)
  })

  it('should return null if product not found by id', async () => {
    prisma.product.findUnique.mockResolvedValue(null)
    const result = await repository.findById('notfound')
    expect(result).toBeNull()
    expect(PrismaProductMapper.toDto).not.toHaveBeenCalled()
  })

  it('should return all products mapped to dto if no category is provided', async () => {
    const dbProducts = [
      {
        id: '1',
        name: 'A',
        description: 'desc',
        category: 'lanche',
        price: new Decimal(10),
      },
      {
        id: '2',
        name: 'B',
        description: 'desc',
        category: 'bebida',
        price: 20,
      },
    ]
    const dtos = [
      {
        id: '1',
        name: 'A',
        description: 'desc',
        category: 'lanche',
        price: new Decimal(10),
      },
      {
        id: '2',
        name: 'B',
        description: 'desc',
        category: 'bebida',
        price: 20,
      },
    ]
    prisma.product.findMany.mockResolvedValue(dbProducts)
    ;(PrismaProductMapper.toDto as any)
      .mockReturnValueOnce(dtos[0])
      .mockReturnValueOnce(dtos[1])

    const result = await repository.findMany({})

    expect(prisma.product.findMany).toHaveBeenCalled()
    expect(PrismaProductMapper.toDto).toHaveBeenCalledTimes(2)
    expect(result).toEqual(dtos)
  })

  it('should filter products by category and map to dto', async () => {
    const dbProducts = [
      {
        id: '1',
        name: 'A',
        description: 'desc',
        category: 'lanche',
        price: new Decimal(10),
      },
      {
        id: '2',
        name: 'B',
        description: 'desc',
        category: 'bebida',
        price: 20,
      },
    ]
    const dtos = [
      {
        id: '1',
        name: 'A',
        description: 'desc',
        category: 'lanche',
        price: new Decimal(10),
      },
    ]
    prisma.product.findMany.mockResolvedValue(dbProducts)
    ;(PrismaProductMapper.toDto as any).mockReturnValueOnce(dtos[0])

    const result = await repository.findMany({ category: 'lanche' })

    expect(prisma.product.findMany).toHaveBeenCalled()
    expect(PrismaProductMapper.toDto).toHaveBeenCalledTimes(1)
    expect(result).toEqual(dtos)
  })
})
