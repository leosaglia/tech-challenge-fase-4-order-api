import { CreateOrderDto } from '@core/application/dtos/create-order-dto'
import { OrderDto } from '@core/application/dtos/order-dto'

export interface IOrderDataSource {
  create(order: CreateOrderDto): Promise<void>
  findMany(): Promise<OrderDto[]>
  findById(id: string): Promise<OrderDto | null>
  updateStatus(orderId: string, newStatus: string): Promise<void>
}
