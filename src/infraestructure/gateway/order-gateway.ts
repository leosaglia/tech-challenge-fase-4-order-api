import { Order } from '@core/enterprise/entities/order'
import { OrderStatus } from '@core/enterprise/enums/order-status'
import { OrderMapper } from './mappers/order-mapper'
import { IOrderGateway } from '@core/application/interfaces/gateway/order-gateway-interface'
import { IOrderDataSource } from '@core/application/interfaces/repository/order-data-source'

export class OrderGateway implements IOrderGateway {
  constructor(private orderDataSource: IOrderDataSource) {}
  async create(order: Order): Promise<void> {
    await this.orderDataSource.create(OrderMapper.toCreateOrderDto(order))
  }

  async findMany(): Promise<Order[]> {
    const orders = await this.orderDataSource.findMany()
    return orders.map(OrderMapper.toDomain)
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.orderDataSource.findById(id)

    if (!order) {
      return null
    }

    return OrderMapper.toDomain(order)
  }

  async updateStatus(orderId: string, newStatus: OrderStatus): Promise<void> {
    await this.orderDataSource.updateStatus(orderId, newStatus)
  }
}
