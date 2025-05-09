import Decimal from 'decimal.js'

export interface OrderItemDto {
  orderId: string
  productId: string
  quantity: number
  productPrice: Decimal
}

export interface OrderDto {
  id: string
  status: string
  items: OrderItemDto[]
  customerId?: string
  createdAt: Date
  updatedAt: Date
}
