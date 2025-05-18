import SqsClient from '../config/sqs.config'
import { OrderController } from '@infra/controllers/order-controller'
import { IProductDataSource } from '@core/application/interfaces/repository/product-data-source'
import { ICustomerDataSource } from '@core/application/interfaces/repository/customer-data-source'
import { IOrderDataSource } from '@core/application/interfaces/repository/order-data-source'

type OrderId = {
  orderId: string
}

export class ProcessedPaymentListener {
  private readonly queueUrl: string
  private readonly sqsClient: SqsClient
  private readonly orderController: OrderController

  constructor(
    orderDataSource: IOrderDataSource,
    productDataSource: IProductDataSource,
    customerDataSource: ICustomerDataSource,
    sqsClient: SqsClient,
  ) {
    this.queueUrl = process.env.PROCESSED_PAYMENT_QUEUE_URL ?? ''
    this.sqsClient = sqsClient
    this.orderController = new OrderController(
      orderDataSource,
      productDataSource,
      customerDataSource,
      sqsClient,
    )
  }

  async listen(): Promise<void> {
    while (true) {
      try {
        await this.receiveMessages()
        // aguardar um tempo antes de verificar novamente
        await new Promise((resolve) => setTimeout(resolve, 10000))
      } catch (error) {
        console.error('Error receiving messages:', error)
      }
    }
  }

  private async receiveMessages(): Promise<void> {
    const messages = await this.sqsClient.receiveMessages<OrderId>(
      this.queueUrl,
    )

    for (const { message, receiptHandles } of messages) {
      console.log('Received message:', message)

      try {
        await this.processMessage(message)
        await this.sqsClient.deleteMessage(this.queueUrl, receiptHandles)
      } catch (error) {
        console.error('Error processing message:', error)
      }
    }
  }

  private async processMessage(message: OrderId): Promise<void> {
    console.log('Processing message:', message)

    await this.orderController.updateOrderStatus(
      message.orderId,
      'Em preparação',
    )
  }
}
