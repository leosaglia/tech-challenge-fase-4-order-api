import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UpdateOrderStatusUseCase } from './update-order-status-use-case'
import { OrderNotFoundError } from '@core/enterprise/custom-exceptions/order-not-found'
import { InvalidOrderError } from '@core/enterprise/custom-exceptions/invalid-order'
import { OrderStatus } from '@core/enterprise/enums/order-status'

describe('UpdateOrderStatusUseCase', () => {
  let orderGateway: {
    findById: ReturnType<typeof vi.fn>
    updateStatus: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
    findMany: ReturnType<typeof vi.fn>
  }
  let useCase: UpdateOrderStatusUseCase
  let orderMock: {
    setStatus: ReturnType<typeof vi.fn>
    getId: ReturnType<typeof vi.fn>
    getStatus: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    orderMock = {
      setStatus: vi.fn(),
      getId: vi.fn(() => 'order-1'),
      getStatus: vi.fn(() => OrderStatus.READY),
    }
    orderGateway = {
      findById: vi.fn(),
      updateStatus: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
    }
    useCase = new UpdateOrderStatusUseCase(orderGateway)
  })

  it('should update status when order exists and status is valid', async () => {
    orderGateway.findById.mockResolvedValue(orderMock)
    const dto = { orderId: 'order-1', status: 'Pronto' }

    await useCase.execute(dto)

    expect(orderGateway.findById).toHaveBeenCalledWith('order-1')
    expect(orderMock.setStatus).toHaveBeenCalledWith(OrderStatus.READY)
    expect(orderGateway.updateStatus).toHaveBeenCalledWith(
      'order-1',
      OrderStatus.READY,
    )
  })

  it('should throw OrderNotFoundError if order not found', async () => {
    orderGateway.findById.mockResolvedValue(null)
    const dto = { orderId: 'order-2', status: OrderStatus.READY }

    await expect(useCase.execute(dto)).rejects.toThrow(OrderNotFoundError)
  })

  it('should throw InvalidOrderError if status is invalid', async () => {
    orderGateway.findById.mockResolvedValue(orderMock)
    const dto = { orderId: 'order-1', status: 'INVALID_STATUS' }

    await expect(useCase.execute(dto)).rejects.toThrow(InvalidOrderError)
    expect(orderMock.setStatus).not.toHaveBeenCalled()
    expect(orderGateway.updateStatus).not.toHaveBeenCalled()
  })
})
