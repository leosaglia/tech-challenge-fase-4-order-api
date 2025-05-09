import { describe, it, expect, vi } from 'vitest'
import { DeleteProductUseCase } from './delete-product-use-case'
import { FindProductByIdUseCase } from './find-product-by-id-use-case'
import { IProductGateway } from '@core/application/interfaces/gateway/product-gateway-interface'
import { ProductNotFoundError } from '@core/enterprise/custom-exceptions/product-not-found'

describe('DeleteProductUseCase', () => {
  let sut: DeleteProductUseCase
  let mockProductGateway: IProductGateway

  beforeEach(() => {
    mockProductGateway = {
      create: vi.fn().mockResolvedValue(undefined),
      edit: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(null),
      findById: vi.fn().mockResolvedValue(undefined),
      findMany: vi.fn().mockResolvedValue([]),
    }
  })

  it('should delete a product when found', async () => {
    const mockFindProductByIdUseCase = {
      execute: vi.fn().mockResolvedValue({
        product: { id: '1', name: 'Test Product', price: 100 },
      }),
    }
    sut = new DeleteProductUseCase(
      mockProductGateway,
      mockFindProductByIdUseCase as unknown as FindProductByIdUseCase,
    )

    const result = await sut.execute('1')

    expect(result).toBeNull()
    expect(mockFindProductByIdUseCase.execute).toHaveBeenCalledWith('1')
    expect(mockProductGateway.delete).toHaveBeenCalledWith('1')
  })

  it('should throw ProductNotFoundError when product is not found', async () => {
    const mockFindProductByIdUseCase = {
      execute: vi
        .fn()
        .mockRejectedValue(new ProductNotFoundError('Product not found.')),
    }
    const useCase = new DeleteProductUseCase(
      mockProductGateway,
      mockFindProductByIdUseCase as unknown as FindProductByIdUseCase,
    )

    await expect(useCase.execute('1')).rejects.toThrow(
      expect.objectContaining({
        message: 'Product not found.',
        name: ProductNotFoundError.name,
      }),
    )

    expect(mockFindProductByIdUseCase.execute).toHaveBeenCalledWith('1')
    expect(mockProductGateway.delete).not.toHaveBeenCalled()
  })
})
