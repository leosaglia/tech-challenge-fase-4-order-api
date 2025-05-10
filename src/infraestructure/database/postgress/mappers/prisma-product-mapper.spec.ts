import { describe, it, expect } from 'vitest'
import { PrismaProductMapper } from './prisma-product-mapper'
import { Prisma, Product as PrismaProduct } from '@prisma/client'
import { ProductDto } from '@core/application/dtos/product-dto'
import Decimal from 'decimal.js'

describe('PrismaProductMapper', () => {
  it('should map PrismaProduct to ProductDto correctly', () => {
    const raw: PrismaProduct = {
      id: 'prod-1',
      name: 'Test Product',
      description: 'A test product',
      price: new Prisma.Decimal(99.99),
      category: 'lanche',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const dto = PrismaProductMapper.toDto(raw)

    expect(dto).toEqual({
      id: 'prod-1',
      name: 'Test Product',
      description: 'A test product',
      price: new Prisma.Decimal('99.99'),
      category: 'lanche',
    })
  })

  it('should map ProductDto to Prisma.ProductUncheckedCreateInput correctly', () => {
    const product: ProductDto = {
      id: 'prod-2',
      name: 'Another Product',
      description: 'Another description',
      price: new Decimal(10.5),
      category: 'bebida',
    }

    const persistence: Prisma.ProductUncheckedCreateInput =
      PrismaProductMapper.toPersistence(product)

    expect(persistence).toEqual({
      id: 'prod-2',
      name: 'Another Product',
      description: 'Another description',
      price: new Decimal(10.5),
      category: 'bebida',
    })
  })

  it('should map ProductDto to Prisma.ProductUpdateInput correctly', () => {
    const product: ProductDto = {
      id: 'prod-3',
      name: 'Update Product',
      description: 'Update description',
      price: new Decimal(5.25),
      category: 'sobremesa',
    }

    const updateInput: Prisma.ProductUpdateInput =
      PrismaProductMapper.toPersistenceUpdate(product)

    expect(updateInput).toEqual({
      name: 'Update Product',
      description: 'Update description',
      price: new Decimal(5.25),
      category: 'sobremesa',
    })
  })
})
