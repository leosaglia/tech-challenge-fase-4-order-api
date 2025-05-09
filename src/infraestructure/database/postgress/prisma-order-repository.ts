import { PrismaService } from '@infra/frameworks/prisma/prisma.service'
import { IOrderDataSource } from '@core/application/interfaces/repository/order-data-source'
import { OrderDto } from '@core/application/dtos/order-dto'
import { PrismaOrderMapper } from './mappers/prisma-order-mapper'

export default class PrismaOrderRepository implements IOrderDataSource {
  constructor(private prisma: PrismaService) {}
  async create(order: OrderDto): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.order.create({
        data: {
          id: order.id,
          status: order.status,
          customerId: order.customerId,
        },
      })

      await prisma.orderItem.createMany({
        data: order.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          productPrice: item.productPrice,
        })),
      })
    })
  }

  async findMany(): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        orderItems: true,
      },
    })

    return orders.map((order) => {
      return PrismaOrderMapper.toDto(order, order.orderItems)
    })
  }

  async findById(id: string): Promise<OrderDto | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        orderItems: true,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDto(order, order.orderItems)
  }

  async updateStatus(orderId: string, newStatus: string): Promise<void> {
    await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: newStatus,
      },
    })
  }
}
