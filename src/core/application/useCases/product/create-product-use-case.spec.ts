import { describe, it, expect, vi } from 'vitest'
import { Decimal } from 'decimal.js'
import { Product } from '@core/enterprise/entities/product'
import { CreateProductUseCase } from './create-product-use-case'
import { CreateProductDto } from '@core/application/dtos/create-product-dto'
import { IProductGateway } from '@core/application/interfaces/gateway/product-gateway-interface'
import { InvalidProductError } from '@core/enterprise/custom-exceptions/invalid-product'
import { InvalidCategoryError } from '@core/enterprise/custom-exceptions/invalid-category'
import { makeCreateProductRequest } from '@test/factories/product-factory'

describe('CreateProductUseCase', () => {
  let sut: CreateProductUseCase
  let mockProductGateway: IProductGateway

  beforeEach(() => {
    mockProductGateway = {
      create: vi.fn().mockResolvedValue(undefined),
      edit: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn().mockResolvedValue(undefined),
      findMany: vi.fn().mockResolvedValue([]),
    }
    sut = new CreateProductUseCase(mockProductGateway)
  })

  it('should create a product successfully', async () => {
    const product: CreateProductDto = makeCreateProductRequest()

    const response = await sut.execute(product)

    expect(response.product).toBeInstanceOf(Product)
    expect(response.product.getName()).toBe(product.name)
    expect(response.product.getPrice()).toStrictEqual(product.price)
    expect(response.product.getDescription()).toBe(product.description)
    expect(response.product.getCategory()).toBe(product.category)
    expect(response.product.getId()).toBeDefined()
    expect(mockProductGateway.create).toHaveBeenCalledWith(response.product)
  })

  const productWithInvalidName = makeCreateProductRequest({ name: '' })

  const productWithInvalidPrice = makeCreateProductRequest({
    price: new Decimal(-100),
  })

  const productWithInvalidDescription = makeCreateProductRequest({
    description: '',
  })

  const productWithInvalidCategory = makeCreateProductRequest({
    category: 'Invalid Category',
  })

  it.each([
    [productWithInvalidName, 'Invalid name.', InvalidProductError],
    [productWithInvalidPrice, 'Invalid price.', InvalidProductError],
    [
      productWithInvalidDescription,
      'Invalid description.',
      InvalidProductError,
    ],
    [productWithInvalidCategory, 'Invalid category.', InvalidCategoryError],
  ])(
    'should throw an error when pass invalid fields to create a product',
    async (invalidProduct, excMessage, ErrorType) => {
      await expect(sut.execute(invalidProduct)).rejects.toThrow(
        expect.objectContaining({
          message: excMessage,
          name: ErrorType.name,
        }),
      )
    },
  )
})
