import { describe, it, expect, vi } from 'vitest'
import { Product } from '@core/enterprise/entities/product'
import { Category } from '@core/enterprise/valueObjects/category'
import { FindProductByIdUseCase } from './find-product-by-id-use-case'
import { EditProductUseCase } from './edit-product-use-case'
import { IProductGateway } from '@core/application/interfaces/gateway/product-gateway-interface'
import { EditProductDto } from '@core/application/dtos/edit-product-dto'
import { ProductNotFoundError } from '@core/enterprise/custom-exceptions/product-not-found'
import {
  makeEditProductRequest,
  makeProduct,
} from '@test/factories/product-factory'

describe('EditProductUseCase', () => {
  let sut: EditProductUseCase
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

  it('should edit a product when found', async () => {
    const mockProduct: Product = makeProduct()

    const mockFindProductByIdUseCase = {
      execute: vi.fn().mockResolvedValue({ product: mockProduct }),
    }
    sut = new EditProductUseCase(
      mockProductGateway,
      mockFindProductByIdUseCase as unknown as FindProductByIdUseCase,
    )

    const request: EditProductDto = makeEditProductRequest()

    const result = await sut.execute(request)

    expect(result.product).toEqual(
      new Product(
        request.name,
        request.price,
        request.description,
        new Category(request.category),
        request.id,
      ),
    )
    expect(mockFindProductByIdUseCase.execute).toHaveBeenCalledWith('1')
    expect(mockProductGateway.edit).toHaveBeenCalledWith(result.product)
  })

  it('should throw ProductNotFoundError when product is not found', async () => {
    const mockFindProductByIdUseCase = {
      execute: vi
        .fn()
        .mockRejectedValue(new ProductNotFoundError('Product not found.')),
    }
    const useCase = new EditProductUseCase(
      mockProductGateway,
      mockFindProductByIdUseCase as unknown as FindProductByIdUseCase,
    )

    const request: EditProductDto = makeEditProductRequest()

    await expect(useCase.execute(request)).rejects.toThrow(
      expect.objectContaining({
        message: 'Product not found.',
        name: ProductNotFoundError.name,
      }),
    )
    expect(mockFindProductByIdUseCase.execute).toHaveBeenCalledWith('1')
    expect(mockProductGateway.edit).not.toHaveBeenCalled()
  })
})
