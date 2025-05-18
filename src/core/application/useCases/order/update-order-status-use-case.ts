import { IOrderGateway } from '@core/application/interfaces/gateway/order-gateway-interface'
import { UpdateOrderStatusUseCaseDto } from '@core/application/dtos/update-order-status-use-case-dto'
import { OrderNotFoundError } from '@core/enterprise/custom-exceptions/order-not-found'
import { OrderStatus } from '@core/enterprise/enums/order-status'
import { InvalidOrderError } from '@core/enterprise/custom-exceptions/invalid-order'

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderGateway: IOrderGateway) {}

  async execute({
    orderId,
    status,
  }: UpdateOrderStatusUseCaseDto): Promise<void> {
    const order = await this.orderGateway.findById(orderId)

    if (!order) {
      throw new OrderNotFoundError(`Order not found for this id ${orderId}`)
    }

    // Valida se o status é válido para o enum OrderStatus
    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      throw new InvalidOrderError(`Invalid order status: ${status}`)
    }

    order.setStatus(status as OrderStatus)

    await this.orderGateway.updateStatus(order.getId(), order.getStatus())
  }
}
