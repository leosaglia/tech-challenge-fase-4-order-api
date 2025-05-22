import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
  SendMessageCommand,
} from '@aws-sdk/client-sqs'

export default class SqsClient {
  private readonly client: SQSClient

  constructor() {
    this.client = new SQSClient({
      region: process.env.AWS_REGION ?? 'us-east-1',
      ...(process.env.ENVIRONMENT === 'local'
        ? { endpoint: process.env.AWS_LOCAL_ENDPOINT }
        : {}),
    })
  }

  async sendMessage<T>(queueUrl: string, message: T): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
    })

    try {
      await this.client.send(command)
      console.log(`Message sent to queue: ${queueUrl}`)
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to send message to queue: ${error.message}`)
      } else {
        console.error(`Failed to send message to queue: ${String(error)}`)
      }
      throw error
    }
  }

  async receiveMessages<T>(
    queueUrl: string,
  ): Promise<{ message: T; receiptHandles: string }[]> {
    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    })

    try {
      const response = await this.client.send(command)
      console.log(`Messages received from queue: ${queueUrl}`)

      const messages = response.Messages ?? []

      return messages.map((msg) => {
        return {
          message: JSON.parse(msg.Body ?? '') as T,
          receiptHandles: msg.ReceiptHandle as string,
        }
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to receive messages from queue: ${error.message}`)
      } else {
        console.error(`Failed to receive messages from queue: ${String(error)}`)
      }
      return []
    }
  }

  async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    const command = new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    })

    try {
      await this.client.send(command)
      console.log(`Message deleted from queue: ${queueUrl}`)
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to delete message from queue: ${error.message}`)
      } else {
        console.error(`Failed to delete message from queue: ${String(error)}`)
      }
      throw error
    }
  }
}
