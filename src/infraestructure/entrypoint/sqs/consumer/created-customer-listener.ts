import SqsClient from '../config/sqs.config'
import { CreateCustomerDto } from '@core/application/dtos/create-customer-dto'
import { CustomerController } from '@infra/controllers/customer-controller'
import { ICustomerDataSource } from '@core/application/interfaces/repository/customer-data-source'

export class CreatedCustomerListener {
  private readonly queueUrl: string
  private readonly sqsClient: SqsClient
  private readonly customerController: CustomerController

  constructor(customerDataSource: ICustomerDataSource, sqsClient: SqsClient) {
    this.queueUrl = process.env.CREATED_CUSTOMER_QUEUE_URL ?? ''
    this.sqsClient = sqsClient
    this.customerController = new CustomerController(customerDataSource)
  }

  async listen(): Promise<void> {
    console.log('Listening for messages CREATED_CUSTOMER_QUEUE')
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
    const messages = await this.sqsClient.receiveMessages<CreateCustomerDto>(
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

  private async processMessage(message: CreateCustomerDto): Promise<void> {
    console.log('Processing message:', message)

    await this.customerController.createCustomer(message)
  }
}
