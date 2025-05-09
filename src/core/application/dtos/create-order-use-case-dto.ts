export interface CreateOrderUseCaseDto {
  items: Array<{
    productId: string
    quantity: number
  }>
  customerDocument?: string
}
