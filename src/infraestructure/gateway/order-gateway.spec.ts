import { describe, it, expect, beforeEach, vi } from 'vitest'
import { OrderGateway } from './order-gateway'
import { OrderStatus } from '@core/enterprise/enums/order-status'
import { Order } from '@core/enterprise/entities/order'
import { IOrderDataSource } from '@core/application/interfaces/repository/order-data-source'
import { OrderMapper } from './mappers/order-mapper'
import { OrderDto, OrderItemDto } from '@core/application/dtos/order-dto'
import Decimal from 'decimal.js'
import { OrderItem } from '@core/enterprise/entities/orderItem'

describe('OrderGateway', () => {
  let orderDataSource: IOrderDataSource
  let gateway: OrderGateway
  let order: Order

  beforeEach(() => {
    orderDataSource = {
      create: vi.fn(),
      findMany: vi.fn(),
      findById: vi.fn(),
      updateStatus: vi.fn(),
    }
    gateway = new OrderGateway(orderDataSource)
    order = new Order('1')
    order.addItem(new OrderItem('1', '1', new Decimal(10), 2))
  })

  it('should call dataSource.create with mapped DTO', async () => {
    await gateway.create(order)
    expect(orderDataSource.create).toHaveBeenCalledWith(
      OrderMapper.toCreateOrderDto(order),
    )
  })

  it('should map all returned orders to domain in findMany', async () => {
    const orderItemDto: OrderItemDto = {
      orderId: '1',
      productId: '2',
      quantity: 2,
      productPrice: new Decimal(10),
    }

    const orderDto: OrderDto = {
      id: '1',
      status: OrderStatus.IN_PROGRESS,
      items: [orderItemDto],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    orderDataSource.findMany = vi.fn().mockResolvedValue([orderDto, orderDto])

    const result = await gateway.findMany()
    expect(orderDataSource.findMany).toHaveBeenCalledTimes(1)
    expect(result.length).toEqual(2)
  })

  it('should return mapped order if found by id', async () => {
    const orderDto: OrderDto = {
      id: '1',
      status: OrderStatus.IN_PROGRESS,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    orderDataSource.findById = vi.fn().mockResolvedValue(orderDto)
    const result = await gateway.findById('1')
    expect(orderDataSource.findById).toHaveBeenCalledWith('1')
    expect(result).toBeInstanceOf(Order)
  })

  it('should return null if order not found by id', async () => {
    orderDataSource.findById = vi.fn().mockResolvedValue(null)
    const result = await gateway.findById('notfound')
    expect(result).toBeNull()
  })

  it('should call dataSource.updateStatus with correct params', async () => {
    await gateway.updateStatus('1', OrderStatus.READY)
    expect(orderDataSource.updateStatus).toHaveBeenCalledWith(
      '1',
      OrderStatus.READY,
    )
  })
})
