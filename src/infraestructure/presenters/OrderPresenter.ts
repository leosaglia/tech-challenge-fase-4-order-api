import { Order } from '@core/enterprise/entities/order'
import { Product } from '@core/enterprise/entities/product'

class OrderItemPresenter {
  private readonly productId: string
  private readonly name?: string
  private readonly price?: string
  private readonly category?: string
  private readonly quantity: number
  private readonly total: string

  constructor(
    productId: string,
    quantity: number,
    total: string,
    name?: string,
    price?: string,
    category?: string,
  ) {
    this.productId = productId
    this.name = name
    this.price = price
    this.category = category
    this.quantity = quantity
    this.total = total
  }
}

export class OrderPresenter {
  private readonly id: string
  private readonly customerId?: string
  private readonly status: string
  private readonly total: string
  private readonly createdAt: string
  private readonly items: OrderItemPresenter[]

  constructor(
    id: string,
    status: string,
    total: string,
    createdAt: string,
    items: OrderItemPresenter[],
    customerId?: string,
  ) {
    this.id = id
    this.customerId = customerId
    this.status = status
    this.total = total
    this.createdAt = createdAt
    this.items = items
  }

  static present(order: Order, products: Product[]): OrderPresenter {
    const orderItems = order.getItems().map((item) => {
      const product = products.find(
        (product) => product.getId() === item.getProductId(),
      )

      return new OrderItemPresenter(
        item.getProductId(),
        item.getQuantity(),
        item.getTotal().toFixed(2),
        product?.getName(),
        product?.getPrice().toFixed(2),
        product?.getCategory(),
      )
    })

    return new OrderPresenter(
      order.getId(),
      order.getStatus(),
      order.getTotal().toFixed(2),
      order.getCreatedAt().toISOString(),
      orderItems,
      order.getCustomerId(),
    )
  }
}
