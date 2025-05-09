import Decimal from 'decimal.js'
import { IPaymentGateway } from '@core/application/interfaces/gateway/payment-gateway-interface'

export class PaymentGateway implements IPaymentGateway {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async processPayment(amount: Decimal): Promise<boolean> {
    return true
  }
}
