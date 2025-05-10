import { describe, it, expect, beforeEach, vi } from 'vitest'
import PrismaOrderRepository from './prisma-order-repository'
import { PrismaOrderMapper } from './mappers/prisma-order-mapper'
import { OrderDto } from '@core/application/dtos/order-dto'

vi.mock('./mappers/prisma-order-mapper', () => ({
  PrismaOrderMapper: {
    toDto: vi.fn(),
  },
}))

describe('PrismaOrderRepository', () => {
  let prisma: any
  let repository: PrismaOrderRepository

  beforeEach(() => {
    prisma = {
      $transaction: vi.fn(),
      order: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      orderItem: {
        createMany: vi.fn(),
      },
    }
    repository = new PrismaOrderRepository(prisma)
    vi.clearAllMocks()
  })

  it('should create an order and its items in a transaction', async () => {
    const order: OrderDto = {
      id: 'order-1',
      status: 'PENDING',
      customerId: 'cust-1',
      items: [
        { productId: 'prod-1', quantity: 2, productPrice: 10 },
        { productId: 'prod-2', quantity: 1, productPrice: 20 },
      ],
    }

    // Simulate $transaction calling the callback with a "prisma" object
    prisma.$transaction.mockImplementation(async (cb: any) => {
      await cb(prisma)
    })

    await repository.create(order)

    expect(prisma.$transaction).toHaveBeenCalled()
    expect(prisma.order.create).toHaveBeenCalledWith({
      data: {
        id: order.id,
        status: order.status,
        customerId: order.customerId,
      },
    })
    expect(prisma.orderItem.createMany).toHaveBeenCalledWith({
      data: [
        {
          orderId: order.id,
          productId: 'prod-1',
          quantity: 2,
          productPrice: 10,
        },
        {
          orderId: order.id,
          productId: 'prod-2',
          quantity: 1,
          productPrice: 20,
        },
      ],
    })
  })

  it('should find many orders and map them to dto', async () => {
    const dbOrders = [
      {
        id: 'order-1',
        status: 'PENDING',
        customerId: 'cust-1',
        orderItems: [{}, {}],
      },
      { id: 'order-2', status: 'DONE', customerId: 'cust-2', orderItems: [{}] },
    ]
    const dtos = [
      { id: 'order-1', status: 'PENDING', customerId: 'cust-1', items: [] },
      { id: 'order-2', status: 'DONE', customerId: 'cust-2', items: [] },
    ]
    prisma.order.findMany.mockResolvedValue(dbOrders)
    ;(PrismaOrderMapper.toDto as any)
      .mockReturnValueOnce(dtos[0])
      .mockReturnValueOnce(dtos[1])

    const result = await repository.findMany()

    expect(prisma.order.findMany).toHaveBeenCalledWith({
      include: { orderItems: true },
    })
    expect(PrismaOrderMapper.toDto).toHaveBeenCalledTimes(2)
    expect(result).toEqual(dtos)
  })

  it('should find an order by id and map to dto', async () => {
    const dbOrder = {
      id: 'order-1',
      status: 'PENDING',
      customerId: 'cust-1',
      orderItems: [{}, {}],
    }
    const dto = {
      id: 'order-1',
      status: 'PENDING',
      customerId: 'cust-1',
      items: [],
    }
    prisma.order.findUnique.mockResolvedValue(dbOrder)
    ;(PrismaOrderMapper.toDto as any).mockReturnValue(dto)

    const result = await repository.findById('order-1')

    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      include: { orderItems: true },
    })
    expect(PrismaOrderMapper.toDto).toHaveBeenCalledWith(
      dbOrder,
      dbOrder.orderItems,
    )
    expect(result).toBe(dto)
  })

  it('should return null if order not found by id', async () => {
    prisma.order.findUnique.mockResolvedValue(null)
    const result = await repository.findById('notfound')
    expect(result).toBeNull()
    expect(PrismaOrderMapper.toDto).not.toHaveBeenCalled()
  })

  it('should update order status', async () => {
    prisma.order.update.mockResolvedValue(undefined)
    await repository.updateStatus('order-1', 'DONE')
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: 'DONE' },
    })
  })
})
