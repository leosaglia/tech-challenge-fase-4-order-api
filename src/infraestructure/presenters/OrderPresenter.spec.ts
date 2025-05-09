import { describe, it, expect } from 'vitest'
import Decimal from 'decimal.js'

import { OrderPresenter } from './OrderPresenter'
import { Order } from '@core/enterprise/entities/order'
import { OrderItem } from '@core/enterprise/entities/orderItem'
import { Product } from '@core/enterprise/entities/product'
import { makeProduct } from '@test/factories/product-factory'

describe('OrderPresenter', () => {
  it('should present an order with products correctly', () => {
    const products: Product[] = []
    const product = makeProduct()
    products.push(product)
    const order = new Order('order-1')
    order.addItem(
      new OrderItem(product.getId(), order.getId(), new Decimal(5), 2),
    )

    const presenter = OrderPresenter.present(order, products)
    expect(presenter).toBeInstanceOf(OrderPresenter)

    expect(presenter).toMatchObject({
      id: 'order-1',
      customerId: undefined,
      status: 'Recebido',
      total: '10.00',
      items: [
        {
          productId: product.getId(),
          name: product.getName(),
          price: product.getPrice().toFixed(2),
          category: product.getCategory(),
          quantity: 2,
          total: '10.00',
        },
      ],
    })
  })
})
