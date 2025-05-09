import { IOrderGateway } from '@core/application/interfaces/gateway/order-gateway-interface'
import { IPaymentGateway } from '@core/application/interfaces/gateway/payment-gateway-interface'
import { DuplicatePaymentError } from '@core/enterprise/custom-exceptions/duplicate-payment'
import { OrderNotFoundError } from '@core/enterprise/custom-exceptions/order-not-found'
import { PaymentProcessingError } from '@core/enterprise/custom-exceptions/payment-processing-error'
import { OrderStatus } from '@core/enterprise/enums/order-status'

export class MakeOrderPaymentUseCase {
  constructor(
    private orderGateway: IOrderGateway,
    private paymentGateway: IPaymentGateway,
  ) {}

  async execute(orderId: string): Promise<void> {
    const order = await this.orderGateway.findById(orderId)

    if (!order) {
      throw new OrderNotFoundError(`Order with id ${orderId} not found.`)
    }

    if (order.getStatus() !== OrderStatus.RECEIVED) {
      throw new DuplicatePaymentError('Order already paid')
    }

    const paymentResult = await this.paymentGateway.processPayment(
      order.getTotal(),
    )

    if (!paymentResult) {
      throw new PaymentProcessingError('Payment failed')
    }

    await this.orderGateway.updateStatus(order.getId(), OrderStatus.IN_PROGRESS)
  }
}
