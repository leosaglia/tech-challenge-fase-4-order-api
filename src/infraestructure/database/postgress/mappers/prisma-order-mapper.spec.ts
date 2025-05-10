import { describe, it, expect } from 'vitest'
import { PrismaOrderMapper } from './prisma-order-mapper'
import { Decimal } from 'decimal.js'

describe('PrismaOrderMapper', () => {
  it('should map PrismaOrder and PrismaOrderItems to OrderDto correctly', () => {
    const prismaOrder = {
      id: 'order-1',
      status: 'PENDING',
      customerId: 'cust-1',
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-02T10:00:00Z'),
    }

    const prismaOrderItems = [
      {
        id: 'item-1',
        orderId: 'order-1',
        productId: 'prod-1',
        productPrice: '10.50',
        quantity: 2,
      },
      {
        id: 'item-2',
        orderId: 'order-1',
        productId: 'prod-2',
        productPrice: '5.00',
        quantity: 1,
      },
    ]

    const dto = PrismaOrderMapper.toDto(
      prismaOrder as any,
      prismaOrderItems as any,
    )

    expect(dto).toEqual({
      id: 'order-1',
      status: 'PENDING',
      customerId: 'cust-1',
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-02T10:00:00Z'),
      items: [
        {
          productId: 'prod-1',
          orderId: 'order-1',
          productPrice: new Decimal('10.50'),
          quantity: 2,
        },
        {
          productId: 'prod-2',
          orderId: 'order-1',
          productPrice: new Decimal('5.00'),
          quantity: 1,
        },
      ],
    })
  })

  it('should set customerId as undefined if null', () => {
    const prismaOrder = {
      id: 'order-2',
      status: 'COMPLETED',
      customerId: null,
      createdAt: new Date('2024-02-01T10:00:00Z'),
      updatedAt: new Date('2024-02-02T10:00:00Z'),
    }

    const prismaOrderItems = []

    const dto = PrismaOrderMapper.toDto(
      prismaOrder as any,
      prismaOrderItems as any,
    )

    expect(dto.customerId).toBeUndefined()
    expect(dto.items).toEqual([])
  })

  it('should map productPrice as Decimal', () => {
    const prismaOrder = {
      id: 'order-3',
      status: 'PENDING',
      customerId: 'cust-2',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const prismaOrderItems = [
      {
        id: 'item-3',
        orderId: 'order-3',
        productId: 'prod-3',
        productPrice: '99.99',
        quantity: 1,
      },
    ]

    const dto = PrismaOrderMapper.toDto(
      prismaOrder as any,
      prismaOrderItems as any,
    )
    expect(dto.items[0].productPrice).toBeInstanceOf(Decimal)
    expect(dto.items[0].productPrice.toString()).toBe('99.99')
  })
})
