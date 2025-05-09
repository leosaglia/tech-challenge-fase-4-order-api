import { describe, it, expect, vi } from 'vitest'
import { FindAllOrdersUseCase } from './find-all-orders-use-case'
import { IOrderGateway } from '@core/application/interfaces/gateway/order-gateway-interface'
import { FindProductByIdUseCase } from '@core/application/useCases/product/find-product-by-id-use-case'
import { Order } from '@core/enterprise/entities/order'
import { Product } from '@core/enterprise/entities/product'
import { OrderItem } from '@core/enterprise/entities/orderItem'
import { IProductGateway } from '@core/application/interfaces/gateway/product-gateway-interface'
import { makeProduct } from '@test/factories/product-factory'
import Decimal from 'decimal.js'
import { OrderStatus } from '@core/enterprise/enums/order-status'
import { ProductNotFoundError } from '@core/enterprise/custom-exceptions/product-not-found'

describe('FindAllOrdersUseCase', () => {
  let sut: FindAllOrdersUseCase
  let mockFindProductByIdUseCase: FindProductByIdUseCase
  let mockOrderGateway: IOrderGateway
  let mockProductGateway: IProductGateway

  beforeEach(() => {
    mockProductGateway = {
      create: vi.fn().mockResolvedValue(undefined),
      edit: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn().mockResolvedValue(undefined),
      findMany: vi.fn().mockResolvedValue([]),
    }
    mockFindProductByIdUseCase = new FindProductByIdUseCase(mockProductGateway)

    mockOrderGateway = {
      create: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue(null),
      findById: vi.fn().mockResolvedValue(null),
      updateStatus: vi.fn().mockResolvedValue(null),
    }

    sut = new FindAllOrdersUseCase(mockOrderGateway, mockFindProductByIdUseCase)
  })

  it('should return orders with their products', async () => {
    const product = makeProduct()
    const order = new Order('order-1')
    order.addItem(
      new OrderItem(product.getId(), order.getId(), new Decimal(5), 2),
    )
    const order2 = new Order('order-2')
    order2.addItem(
      new OrderItem(product.getId(), order.getId(), new Decimal(5), 2),
    )

    mockOrderGateway.findMany = vi.fn().mockResolvedValue([order, order2])

    mockFindProductByIdUseCase.execute = vi.fn().mockImplementation(() => {
      return { product }
    })

    sut = new FindAllOrdersUseCase(mockOrderGateway, mockFindProductByIdUseCase)

    const response = await sut.execute()
    expect(response.orders).toHaveLength(2)
    expect(response.orders[0].products).toHaveLength(1)
    expect(response.orders[0].products[0]).toBeInstanceOf(Product)
    expect(response.orders[1].products).toHaveLength(1)
    expect(response.orders[1].products[0]).toBeInstanceOf(Product)
  })

  it('should sort orders by status and creation date', async () => {
    const product = makeProduct()
    const order = new Order(
      'order-1',
      OrderStatus.RECEIVED,
      undefined,
      [],
      new Date('2023-01-03'),
    )
    order.addItem(
      new OrderItem(product.getId(), order.getId(), new Decimal(5), 2),
    )

    const order2 = new Order(
      'order-2',
      OrderStatus.READY,
      undefined,
      [],
      new Date('2023-01-15'),
    )
    order2.addItem(
      new OrderItem(product.getId(), order.getId(), new Decimal(5), 2),
    )

    const order3 = new Order(
      'order-3',
      OrderStatus.IN_PROGRESS,
      undefined,
      [],
      new Date('2023-01-01'),
    )
    order3.addItem(
      new OrderItem(product.getId(), order.getId(), new Decimal(5), 2),
    )
    const order4 = new Order(
      'order-4',
      OrderStatus.READY,
      undefined,
      [],
      new Date('2023-01-05'),
    )
    order4.addItem(
      new OrderItem(product.getId(), order.getId(), new Decimal(5), 2),
    )

    mockOrderGateway.findMany = vi
      .fn()
      .mockResolvedValue([order, order2, order3, order4])

    mockFindProductByIdUseCase.execute = vi.fn().mockImplementation(() => {
      return { product }
    })

    sut = new FindAllOrdersUseCase(mockOrderGateway, mockFindProductByIdUseCase)

    const response = await sut.execute()

    expect(response.orders).toHaveLength(4)
    expect(response.orders[0].order.getId()).toBe('order-4')
    expect(response.orders[1].order.getId()).toBe('order-2')
    expect(response.orders[2].order.getId()).toBe('order-3')
    expect(response.orders[3].order.getId()).toBe('order-1')
  })

  it('should return empty list if there are no orders', async () => {
    mockOrderGateway.findMany = vi.fn().mockResolvedValue([])
    const response = await sut.execute()
    expect(response.orders).toHaveLength(0)
  })

  it('should throw ProductNotFoundError if product is not found', async () => {
    const product = makeProduct()
    const order = new Order('order-1')
    order.addItem(
      new OrderItem(product.getId(), order.getId(), new Decimal(5), 2),
    )

    mockOrderGateway.findMany = vi.fn().mockResolvedValue([order])

    sut = new FindAllOrdersUseCase(mockOrderGateway, mockFindProductByIdUseCase)

    await expect(sut.execute()).rejects.toThrow(
      expect.objectContaining({
        message: 'Product with id 1 not found.',
        name: ProductNotFoundError.name,
      }),
    )
  })
})
