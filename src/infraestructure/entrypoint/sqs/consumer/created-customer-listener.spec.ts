import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreatedCustomerListener } from './created-customer-listener'
import SqsClient from '../config/sqs.config'
import { ICustomerDataSource } from '@core/application/interfaces/repository/customer-data-source'

vi.mock('../config/sqs.config', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      receiveMessages: vi.fn(),
      deleteMessage: vi.fn(),
    })),
  }
})

vi.mock('@infra/controllers/customer-controller', () => {
  return {
    CustomerController: vi.fn().mockImplementation(() => ({
      createCustomer: vi.fn(),
    })),
  }
})

type SqsClientMock = {
  receiveMessages: ReturnType<typeof vi.fn>
  deleteMessage: ReturnType<typeof vi.fn>
}
type CustomerControllerMock = {
  createCustomer: ReturnType<typeof vi.fn>
}

describe('CreatedCustomerListener', () => {
  let listener: CreatedCustomerListener
  let customerDataSource: ICustomerDataSource
  let sqsClient: SqsClient

  beforeEach(() => {
    customerDataSource = {} as ICustomerDataSource
    sqsClient = {
      receiveMessages: vi.fn(),
      deleteMessage: vi.fn(),
    } as unknown as SqsClient
    listener = new CreatedCustomerListener(customerDataSource, sqsClient)
  })

  it('should process and delete messages received', async () => {
    const message = { name: 'John', email: 'john@email.com' }
    const sqsClientMock = (listener as unknown as { sqsClient: SqsClientMock })
      .sqsClient
    const customerControllerMock = (
      listener as unknown as { customerController: CustomerControllerMock }
    ).customerController
    sqsClientMock.receiveMessages.mockResolvedValueOnce([
      { message, receiptHandles: 'abc' },
    ])
    customerControllerMock.createCustomer.mockResolvedValueOnce(undefined)
    sqsClientMock.deleteMessage.mockResolvedValueOnce(undefined)

    await (
      listener as unknown as { receiveMessages: () => Promise<void> }
    ).receiveMessages()
    expect(customerControllerMock.createCustomer).toHaveBeenCalledWith(message)
    expect(sqsClientMock.deleteMessage).toHaveBeenCalledWith(
      expect.any(String),
      'abc',
    )
  })

  it('should handle error in processMessage and not throw', async () => {
    const message = { name: 'Jane', email: 'jane@email.com' }
    const sqsClientMock = (listener as unknown as { sqsClient: SqsClientMock })
      .sqsClient
    const customerControllerMock = (
      listener as unknown as { customerController: CustomerControllerMock }
    ).customerController
    sqsClientMock.receiveMessages.mockResolvedValueOnce([
      { message, receiptHandles: 'def' },
    ])
    customerControllerMock.createCustomer.mockRejectedValueOnce(
      new Error('fail'),
    )
    sqsClientMock.deleteMessage.mockResolvedValueOnce(undefined)

    await (
      listener as unknown as { receiveMessages: () => Promise<void> }
    ).receiveMessages()
    expect(customerControllerMock.createCustomer).toHaveBeenCalledWith(message)
    expect(sqsClientMock.deleteMessage).not.toHaveBeenCalled()
  })

  it('should call createCustomer in processMessage', async () => {
    const message = { name: 'Bob', email: 'bob@email.com' }
    const customerControllerMock = (
      listener as unknown as { customerController: CustomerControllerMock }
    ).customerController
    customerControllerMock.createCustomer.mockResolvedValueOnce(undefined)
    await (
      listener as unknown as {
        processMessage: (msg: { name: string; email: string }) => Promise<void>
      }
    ).processMessage(message)
    expect(customerControllerMock.createCustomer).toHaveBeenCalledWith(message)
  })
})
