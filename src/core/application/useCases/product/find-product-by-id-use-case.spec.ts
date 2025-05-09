import { describe, it, expect, vi } from 'vitest'
import { Product } from '@core/enterprise/entities/product'
import { FindProductByIdUseCase } from './find-product-by-id-use-case'
import { IProductGateway } from '@core/application/interfaces/gateway/product-gateway-interface'
import { ProductNotFoundError } from '@core/enterprise/custom-exceptions/product-not-found'
import { makeProduct } from '@test/factories/product-factory'

describe('FindProductByIdUseCase', () => {
  let sut: FindProductByIdUseCase
  let mockProductGateway: IProductGateway

  beforeEach(() => {
    mockProductGateway = {
      create: vi.fn().mockResolvedValue(undefined),
      edit: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn().mockResolvedValue(undefined),
      findMany: vi.fn().mockResolvedValue([]),
    }
    sut = new FindProductByIdUseCase(mockProductGateway)
  })

  it('should return a product when found', async () => {
    const mockProduct: Product = makeProduct()
    mockProductGateway.findById = vi.fn().mockResolvedValue(mockProduct)

    sut = new FindProductByIdUseCase(mockProductGateway)

    const result = await sut.execute('1')

    expect(result).toEqual({ product: mockProduct })
    expect(mockProductGateway.findById).toHaveBeenCalledWith('1')
  })

  it('should throw ProductNotFoundError when product is not found', async () => {
    mockProductGateway.findById = vi.fn().mockResolvedValue(null)
    sut = new FindProductByIdUseCase(mockProductGateway)

    await expect(sut.execute('1')).rejects.toThrow(
      expect.objectContaining({
        message: 'Product with id 1 not found.',
        name: ProductNotFoundError.name,
      }),
    )
    expect(mockProductGateway.findById).toHaveBeenCalledWith('1')
  })
})
