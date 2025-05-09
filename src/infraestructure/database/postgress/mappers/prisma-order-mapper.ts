import { OrderDto } from '@core/application/dtos/order-dto'
import {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
} from '@prisma/client'
import Decimal from 'decimal.js'

export class PrismaOrderMapper {
  static toDto(
    prismaOrder: PrismaOrder,
    prismaOrderItems: PrismaOrderItem[],
  ): OrderDto {
    const { id, status, customerId, createdAt, updatedAt } = prismaOrder

    const orderItems = prismaOrderItems.map((item) => {
      const { productId, productPrice, quantity } = item
      return {
        productId,
        orderId: id,
        productPrice: new Decimal(productPrice),
        quantity,
      }
    })

    return {
      id,
      status,
      items: orderItems,
      customerId: customerId ?? undefined,
      createdAt,
      updatedAt,
    }
  }
}
