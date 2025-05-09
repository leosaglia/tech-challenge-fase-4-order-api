import Decimal from 'decimal.js'

import { OrderItem } from './orderItem'
import { OrderStatus } from '../enums/order-status'
import { UniqueEntityId } from '../valueObjects/unique-entity-id'

export class Order {
  private id: UniqueEntityId
  private items: OrderItem[] = []
  private customerId?: UniqueEntityId
  private createdAt: Date
  private updatedAt: Date
  private status: OrderStatus

  constructor(
    id?: string,
    status?: OrderStatus,
    customerId?: string,
    items?: OrderItem[],
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = new UniqueEntityId(id)
    this.status = status || OrderStatus.RECEIVED
    this.customerId = customerId ? new UniqueEntityId(customerId) : undefined
    this.createdAt = createdAt || new Date()
    this.updatedAt = updatedAt || new Date()
    this.items = items || []
  }

  addItem(item: OrderItem): void {
    const existingItem = this.items.find((i) => i.equals(item))

    if (existingItem) {
      this.updateDuplicatedItem(item)
    } else {
      this.items.push(item)
    }
  }

  private updateDuplicatedItem(updatedItem: OrderItem): void {
    this.items = this.items.map((item) => {
      if (item.equals(updatedItem)) {
        item.setQuantity(item.getQuantity() + updatedItem.getQuantity())
      }
      return item
    })
  }

  updateItem(updatedItem: OrderItem): void {
    this.items = this.items.map((item) =>
      item.equals(updatedItem) ? updatedItem : item,
    )
  }

  getTotal(): Decimal {
    return this.items.reduce(
      (total, item) => total.add(item.getTotal()),
      new Decimal(0),
    )
  }

  getId(): string {
    return this.id.getValue()
  }

  getItems(): OrderItem[] {
    return this.items
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }

  getStatus(): OrderStatus {
    return this.status
  }

  setStatus(status: OrderStatus): void {
    this.status = status
  }

  setCustomerId(customerId: string): void {
    this.customerId = new UniqueEntityId(customerId)
  }

  getCustomerId(): string | undefined {
    return this.customerId?.getValue()
  }
}
