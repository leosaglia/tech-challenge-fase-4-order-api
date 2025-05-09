import { OrderItemDto } from './order-dto'

export interface CreateOrderDto {
  id: string
  status: string
  items: OrderItemDto[]
  customerId?: string
}
