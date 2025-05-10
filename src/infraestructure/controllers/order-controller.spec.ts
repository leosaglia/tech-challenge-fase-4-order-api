import { describe, it, expect, beforeEach, vi } from 'vitest'
import { OrderController } from './order-controller'
import { CreateOrderUseCaseDto } from '@core/application/dtos/create-order-use-case-dto'
import { Order } from '@core/enterprise/entities/order'
import { Product } from '@core/enterprise/entities/product'
import { Category } from '@core/enterprise/valueObjects/category'
import Decimal from 'decimal.js'
import { OrderPresenter } from '@infra/presenters/OrderPresenter'

// src/infraestructure/controllers/order-controller.test.ts

vi.mock('@core/application/useCases/order/create-order-use-case', () => ({
  CreateOrderUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn().mockResolvedValue({
      order: new Order('1'),
      products: [
        new Product(
          'prod-1',
          new Decimal(10),
          'Uma descricao do produto',
          new Category('lanche'),
        ),
        new Product(
          'prod-2',
          new Decimal(20),
          'Uma descricao do produto',
          new Category('bebida'),
        ),
      ],
    }),
  })),
}))
vi.mock('@core/application/useCases/order/find-all-orders-use-case', () => ({
  FindAllOrdersUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn().mockResolvedValue({
      orders: [
        {
          order: new Order('1'),
          products: [
            new Product(
              'prod-2',
              new Decimal(20),
              'Uma descricao do produto',
              new Category('bebida'),
            ),
          ],
        },
        {
          order: new Order('2'),
          products: [
            new Product(
              'prod-2',
              new Decimal(20),
              'Uma descricao do produto',
              new Category('bebida'),
            ),
          ],
        },
      ],
    }),
  })),
}))
vi.mock('@core/application/useCases/product/find-product-by-id-use-case')
vi.mock(
  '@core/application/useCases/costumer/identify-customer-by-document-use-case',
)

describe('OrderController', () => {
  const mockOrderDataSource = {
    create: vi.fn(),
    findMany: vi.fn(),
    findById: vi.fn(),
    updateStatus: vi.fn(),
  }
  const mockProductDataSource = {
    create: vi.fn(),
    edit: vi.fn(),
    delete: vi.fn(),
    findById: vi.fn(),
    findMany: vi.fn(),
  }
  const mockCustomerDataSource = {
    create: vi.fn(),
    findByDocument: vi.fn(),
    findById: vi.fn(),
  }

  let controller: OrderController

  beforeEach(() => {
    controller = new OrderController(
      mockOrderDataSource,
      mockProductDataSource,
      mockCustomerDataSource,
    )
  })

  it('should create an order and return a presenter', async () => {
    const dto: CreateOrderUseCaseDto = {
      customerDocument: '111.444.777-35',
      items: [{ productId: 'prod-1', quantity: 2 }],
    }
    const result = await controller.createOrder(dto)

    expect(result).toBeInstanceOf(OrderPresenter)
  })

  it('should find all orders and return presenters', async () => {
    const result = await controller.findAllOrders()
    expect(result.length).toBe(2)
    expect(result[0]).toBeInstanceOf(OrderPresenter)
    expect(result[1]).toBeInstanceOf(OrderPresenter)
  })
})
