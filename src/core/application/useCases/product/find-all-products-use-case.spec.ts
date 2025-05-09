import Decimal from 'decimal.js'
import { describe, it, expect, vi } from 'vitest'
import { Product } from '@core/enterprise/entities/product'
import { Category } from '@core/enterprise/valueObjects/category'
import { FindAllProductsUseCase } from './find-all-products-use-case'
import { IProductGateway } from '@core/application/interfaces/gateway/product-gateway-interface'
import { InvalidCategoryError } from '@core/enterprise/custom-exceptions/invalid-category'

describe('FindAllProductsUseCase', () => {
  let sut: FindAllProductsUseCase
  let mockProductGateway: IProductGateway

  beforeEach(() => {
    mockProductGateway = {
      create: vi.fn().mockResolvedValue(undefined),
      edit: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn().mockResolvedValue(undefined),
      findMany: vi
        .fn()
        .mockResolvedValue([
          new Product(
            'Product 1',
            new Decimal(10),
            'Description 1',
            new Category('Acompanhamento'),
          ),
          new Product(
            'Product 2',
            new Decimal(20),
            'Description 2',
            new Category('Lanche'),
          ),
          new Product(
            'Product 3',
            new Decimal(30),
            'Description 3',
            new Category('Acompanhamento'),
          ),
        ]),
    }
    sut = new FindAllProductsUseCase(mockProductGateway)
  })

  it('should return all products when no category is specified', async () => {
    const response = await sut.execute({})

    expect(response.products).toHaveLength(3)
    expect(response.products[0].getName()).toBe('Product 1')
    expect(response.products[1].getName()).toBe('Product 2')
    expect(response.products[2].getName()).toBe('Product 3')
  })

  it('should return products filtered by category', async () => {
    const response = await sut.execute({ category: 'Acompanhamento' })

    expect(response.products).toHaveLength(2)
    expect(response.products[0].getName()).toBe('Product 1')
    expect(response.products[1].getName()).toBe('Product 3')
    expect(mockProductGateway.findMany).toHaveBeenCalledWith({
      category: 'acompanhamento',
    })
  })

  it('should handle no products found', async () => {
    mockProductGateway.findMany = vi.fn().mockResolvedValue([])

    sut = new FindAllProductsUseCase(mockProductGateway)
    const response = await sut.execute({ category: 'Bebida' })

    expect(response.products).toHaveLength(0)
    expect(mockProductGateway.findMany).toHaveBeenCalledWith({
      category: 'bebida',
    })
  })

  it('should throw an error if category is invalid', async () => {
    mockProductGateway.findMany = vi.fn().mockResolvedValue([])

    sut = new FindAllProductsUseCase(mockProductGateway)

    await expect(sut.execute({ category: 'Invalid category' })).rejects.toThrow(
      expect.objectContaining({
        message: 'Invalid category.',
        name: InvalidCategoryError.name,
      }),
    )
  })
})
