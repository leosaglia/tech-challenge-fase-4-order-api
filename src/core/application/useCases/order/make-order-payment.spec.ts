import { describe, it, expect, vi } from 'vitest'
import { MakeOrderPaymentUseCase } from './make-order-payment'
import { IOrderGateway } from '@core/application/interfaces/gateway/order-gateway-interface'
import { IPaymentGateway } from '@core/application/interfaces/gateway/payment-gateway-interface'
import { OrderNotFoundError } from '@core/enterprise/custom-exceptions/order-not-found'
import { DuplicatePaymentError } from '@core/enterprise/custom-exceptions/duplicate-payment'
import { PaymentProcessingError } from '@core/enterprise/custom-exceptions/payment-processing-error'
import { OrderStatus } from '@core/enterprise/enums/order-status'
import { Order } from '@core/enterprise/entities/order'

describe('MakeOrderPaymentUseCase', () => {
  let mockOrderGateway: IOrderGateway
  let mockPaymentGateway: IPaymentGateway
  let sut: MakeOrderPaymentUseCase

  beforeEach(() => {
    mockOrderGateway = {
      create: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue(null),
      findById: vi.fn().mockResolvedValue(null),
      updateStatus: vi.fn().mockResolvedValue(null),
    }

    mockPaymentGateway = {
      processPayment: vi.fn().mockReturnValue(true),
    }

    sut = new MakeOrderPaymentUseCase(mockOrderGateway, mockPaymentGateway)
  })

  it('should throw OrderNotFoundError if order is not found', async () => {
    mockOrderGateway.findById = vi.fn().mockResolvedValue(null)

    sut = new MakeOrderPaymentUseCase(mockOrderGateway, mockPaymentGateway)

    await expect(sut.execute('invalid-order-id')).rejects.toThrow(
      expect.objectContaining({
        message: 'Order with id invalid-order-id not found.',
        name: OrderNotFoundError.name,
      }),
    )
  })

  it('should throw DuplicatePaymentError if order is already paid', async () => {
    const order = new Order()
    order.setStatus(OrderStatus.IN_PROGRESS)
    mockOrderGateway.findById = vi.fn().mockResolvedValue(order)

    sut = new MakeOrderPaymentUseCase(mockOrderGateway, mockPaymentGateway)

    await expect(sut.execute('order-id')).rejects.toThrow(
      expect.objectContaining({
        message: 'Order already paid',
        name: DuplicatePaymentError.name,
      }),
    )
  })

  it('should throw PaymentProcessingError if payment fails', async () => {
    const order = new Order()
    mockOrderGateway.findById = vi.fn().mockResolvedValue(order)

    mockPaymentGateway.processPayment = vi.fn().mockResolvedValue(false)

    sut = new MakeOrderPaymentUseCase(mockOrderGateway, mockPaymentGateway)
    await expect(sut.execute('order-id')).rejects.toThrow(
      expect.objectContaining({
        message: 'Payment failed',
        name: PaymentProcessingError.name,
      }),
    )
  })

  it('should update order status to IN_PROGRESS if payment is successful', async () => {
    const order = new Order()
    mockOrderGateway.findById = vi.fn().mockResolvedValue(order)

    sut = new MakeOrderPaymentUseCase(mockOrderGateway, mockPaymentGateway)

    await sut.execute(order.getId())

    expect(mockOrderGateway.updateStatus).toHaveBeenCalledWith(
      order.getId(),
      OrderStatus.IN_PROGRESS,
    )
  })
})
