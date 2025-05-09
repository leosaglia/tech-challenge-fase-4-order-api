import { Order } from '@core/enterprise/entities/order'
import { OrderStatus } from '@core/enterprise/enums/order-status'

export interface IOrderGateway {
  create(order: Order): Promise<void>
  findMany(): Promise<Order[]>
  findById(id: string): Promise<Order | null>
  updateStatus(orderId: string, newStatus: OrderStatus): Promise<void>
}
