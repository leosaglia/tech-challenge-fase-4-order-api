import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProcessedPaymentListener } from './processed-payment-listener'
import SqsClient from '../config/sqs.config'
import { IOrderDataSource } from '@core/application/interfaces/repository/order-data-source'
import { IProductDataSource } from '@core/application/interfaces/repository/product-data-source'
import { ICustomerDataSource } from '@core/application/interfaces/repository/customer-data-source'

vi.mock('../config/sqs.config', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      receiveMessages: vi.fn(),
      deleteMessage: vi.fn(),
    })),
  }
})

vi.mock('@infra/controllers/order-controller', () => {
  return {
    OrderController: vi.fn().mockImplementation(() => ({
      updateOrderStatus: vi.fn(),
    })),
  }
})

type SqsClientMock = {
  receiveMessages: ReturnType<typeof vi.fn>
  deleteMessage: ReturnType<typeof vi.fn>
}
type OrderControllerMock = {
  updateOrderStatus: ReturnType<typeof vi.fn>
}

describe('ProcessedPaymentListener', () => {
  let listener: ProcessedPaymentListener
  let orderDataSource: IOrderDataSource
  let productDataSource: IProductDataSource
  let customerDataSource: ICustomerDataSource
  let sqsClient: SqsClient

  beforeEach(() => {
    orderDataSource = {} as IOrderDataSource
    productDataSource = {} as IProductDataSource
    customerDataSource = {} as ICustomerDataSource
    sqsClient = {
      receiveMessages: vi.fn(),
      deleteMessage: vi.fn(),
    } as unknown as SqsClient
    listener = new ProcessedPaymentListener(
      orderDataSource,
      productDataSource,
      customerDataSource,
      sqsClient,
    )
  })

  it('should process and delete messages received', async () => {
    const message = { orderId: 'order-1' }
    const sqsClientMock = (listener as unknown as { sqsClient: SqsClientMock })
      .sqsClient
    const orderControllerMock = (
      listener as unknown as { orderController: OrderControllerMock }
    ).orderController
    sqsClientMock.receiveMessages.mockResolvedValueOnce([
      { message, receiptHandles: 'abc' },
    ])
    orderControllerMock.updateOrderStatus.mockResolvedValueOnce(undefined)
    sqsClientMock.deleteMessage.mockResolvedValueOnce(undefined)

    await (
      listener as unknown as { receiveMessages: () => Promise<void> }
    ).receiveMessages()
    expect(orderControllerMock.updateOrderStatus).toHaveBeenCalledWith(
      'order-1',
      'Em preparação',
    )
    expect(sqsClientMock.deleteMessage).toHaveBeenCalledWith(
      expect.any(String),
      'abc',
    )
  })

  it('should handle error in processMessage and not throw', async () => {
    const message = { orderId: 'order-2' }
    const sqsClientMock = (listener as unknown as { sqsClient: SqsClientMock })
      .sqsClient
    const orderControllerMock = (
      listener as unknown as { orderController: OrderControllerMock }
    ).orderController
    sqsClientMock.receiveMessages.mockResolvedValueOnce([
      { message, receiptHandles: 'def' },
    ])
    orderControllerMock.updateOrderStatus.mockRejectedValueOnce(
      new Error('fail'),
    )
    sqsClientMock.deleteMessage.mockResolvedValueOnce(undefined)

    await (
      listener as unknown as { receiveMessages: () => Promise<void> }
    ).receiveMessages()
    expect(orderControllerMock.updateOrderStatus).toHaveBeenCalledWith(
      'order-2',
      'Em preparação',
    )
    expect(sqsClientMock.deleteMessage).not.toHaveBeenCalled()
  })

  it('should call updateOrderStatus in processMessage', async () => {
    const message = { orderId: 'order-3' }
    const orderControllerMock = (
      listener as unknown as { orderController: OrderControllerMock }
    ).orderController
    orderControllerMock.updateOrderStatus.mockResolvedValueOnce(undefined)
    await (
      listener as unknown as {
        processMessage: (msg: { orderId: string }) => Promise<void>
      }
    ).processMessage(message)
    expect(orderControllerMock.updateOrderStatus).toHaveBeenCalledWith(
      'order-3',
      'Em preparação',
    )
  })
})
