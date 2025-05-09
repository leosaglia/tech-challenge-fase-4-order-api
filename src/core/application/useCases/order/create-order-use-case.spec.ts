import { describe, it, expect, vi } from 'vitest'
import { Order } from '@core/enterprise/entities/order'
import { Product } from '@core/enterprise/entities/product'
import { OrderItem } from '@core/enterprise/entities/orderItem'
import { IOrderGateway } from '@core/application/interfaces/gateway/order-gateway-interface'
import { IProductGateway } from '@core/application/interfaces/gateway/product-gateway-interface'
import { ICustomerGateway } from '@core/application/interfaces/gateway/customer-gateway-interface'
import { CreateOrderUseCase } from './create-order-use-case'
import { FindProductByIdUseCase } from '@core/application/useCases/product/find-product-by-id-use-case'
import { IdentifyCustomerByDocumentUseCase } from '@core/application/useCases/costumer/identify-customer-by-document-use-case'
import { makeProduct } from '@test/factories/product-factory'
import { makeCustomer } from '@test/factories/customer-factory'
import { InvalidOrderError } from '@core/enterprise/custom-exceptions/invalid-order'
import { CustomerNotFoundError } from '@core/enterprise/custom-exceptions/customer-not-found'

describe('CreateOrderUseCase', () => {
  let sut: CreateOrderUseCase
  let mockFindProductByIdUseCase: FindProductByIdUseCase
  let mockIdentifyCustomerByDocumentUseCase: IdentifyCustomerByDocumentUseCase
  let mockOrderGateway: IOrderGateway
  let mockProductGateway: IProductGateway
  let mockCustomerGateway: ICustomerGateway

  beforeEach(() => {
    mockProductGateway = {
      create: vi.fn().mockResolvedValue(undefined),
      edit: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn().mockResolvedValue(undefined),
      findMany: vi.fn().mockResolvedValue([]),
    }
    mockFindProductByIdUseCase = new FindProductByIdUseCase(mockProductGateway)

    mockCustomerGateway = {
      create: vi.fn().mockResolvedValue(null),
      findByDocument: vi.fn().mockResolvedValue(null),
      findById: vi.fn().mockResolvedValue(null),
    }

    mockIdentifyCustomerByDocumentUseCase =
      new IdentifyCustomerByDocumentUseCase(mockCustomerGateway)

    mockOrderGateway = {
      create: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue(null),
      findById: vi.fn().mockResolvedValue(null),
      updateStatus: vi.fn().mockResolvedValue(null),
    }

    sut = new CreateOrderUseCase(
      mockOrderGateway,
      mockFindProductByIdUseCase,
      mockIdentifyCustomerByDocumentUseCase,
    )
  })

  it('should throw InvalidOrderError if no items are provided', async () => {
    await expect(
      sut.execute({ items: [], customerDocument: '123' }),
    ).rejects.toThrow(
      expect.objectContaining({
        message: 'You must pass products to create an order',
        name: InvalidOrderError.name,
      }),
    )
  })

  it('should create an order with valid items and customer document', async () => {
    const product = makeProduct()
    const customer = makeCustomer()

    mockFindProductByIdUseCase.execute = vi.fn().mockResolvedValue({
      product,
    })

    mockIdentifyCustomerByDocumentUseCase.execute = vi
      .fn()
      .mockResolvedValue({ customer })

    sut = new CreateOrderUseCase(
      mockOrderGateway,
      mockFindProductByIdUseCase,
      mockIdentifyCustomerByDocumentUseCase,
    )

    const items = [{ productId: product.getId(), quantity: 2 }]

    const response = await sut.execute({
      items,
      customerDocument: customer.getDocument(),
    })

    expect(response.order).toBeInstanceOf(Order)
    expect(response.products).toHaveLength(1)
    expect(response.products[0]).toBeInstanceOf(Product)
    expect(response.products[0].getId()).toEqual(product.getId())
    expect(mockOrderGateway.create).toHaveBeenCalledOnce()
  })

  it('should create an order with valid items and no customer document', async () => {
    const product = makeProduct()

    mockFindProductByIdUseCase.execute = vi.fn().mockResolvedValue({
      product,
    })

    sut = new CreateOrderUseCase(
      mockOrderGateway,
      mockFindProductByIdUseCase,
      mockIdentifyCustomerByDocumentUseCase,
    )

    const items = [{ productId: product.getId(), quantity: 2 }]

    const response = await sut.execute({
      items,
    })

    expect(response.order).toBeInstanceOf(Order)
    expect(response.products).toHaveLength(1)
    expect(response.products[0]).toBeInstanceOf(Product)
    expect(response.products[0].getId()).toEqual(product.getId())
    expect(mockOrderGateway.create).toHaveBeenCalled()
  })

  it('should agrupe products when duplicated in same order', async () => {
    const product = makeProduct()

    mockFindProductByIdUseCase.execute = vi.fn().mockResolvedValue({
      product,
    })

    sut = new CreateOrderUseCase(
      mockOrderGateway,
      mockFindProductByIdUseCase,
      mockIdentifyCustomerByDocumentUseCase,
    )

    const items = [
      { productId: product.getId(), quantity: 1 },
      { productId: product.getId(), quantity: 5 },
    ]

    const response = await sut.execute({
      items,
    })

    expect(response.order).toBeInstanceOf(Order)
    expect(response.order.getItems()).toHaveLength(1)
    expect(response.order.getItems()[0]).toBeInstanceOf(OrderItem)
    expect(response.order.getItems()[0].getProductId()).toEqual(product.getId())
    expect(response.order.getItems()[0].getQuantity()).toBe(6)
    expect(mockOrderGateway.create).toHaveBeenCalled()
  })

  it('should throw CustomerNotFoundError if customer is not found', async () => {
    const items = [{ productId: '1234', quantity: 2 }]

    await expect(
      sut.execute({ items, customerDocument: '111.444.777-35' }),
    ).rejects.toThrow(
      expect.objectContaining({
        message: 'Customer not created',
        name: CustomerNotFoundError.name,
      }),
    )
  })
})
