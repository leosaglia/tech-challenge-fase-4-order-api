import { Order } from '@core/enterprise/entities/order'
import { OrderItem } from '@core/enterprise/entities/orderItem'
import { OrderStatus } from '@core/enterprise/enums/order-status'
import { OrderDto } from '@core/application/dtos/order-dto'
import { CreateOrderDto } from '@core/application/dtos/create-order-dto'

export class OrderMapper {
  static toDomain(order: OrderDto): Order {
    const orderItems = order.items.map(
      (item) =>
        new OrderItem(
          item.productId,
          order.id,
          item.productPrice,
          item.quantity,
        ),
    )
    return new Order(
      order.id,
      order.status as OrderStatus,
      order.customerId,
      orderItems,
      order.createdAt,
      order.updatedAt,
    )
  }

  static toCreateOrderDto(order: Order): CreateOrderDto {
    return {
      customerId: order.getCustomerId(),
      items: order.getItems().map((item) => ({
        productId: item.getProductId(),
        quantity: item.getQuantity(),
        orderId: order.getId(),
        productPrice: item.getProductPrice(),
      })),
      status: order.getStatus(),
      id: order.getId(),
    }
  }
}
