import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CustomerGateway } from './customer-gateway'
import { Customer } from '@core/enterprise/entities/customer'
import { ICustomerDataSource } from '@core/application/interfaces/repository/customer-data-source'
import { Document } from '@core/enterprise/valueObjects/document'
import { CreateCustomerDto } from '@core/application/dtos/create-customer-dto'

describe('CustomerGateway', () => {
  let customerDataSource: ICustomerDataSource
  let gateway: CustomerGateway
  let customer: Customer

  beforeEach(() => {
    customerDataSource = {
      create: vi.fn(),
      findByDocument: vi.fn(),
      findById: vi.fn(),
    }
    gateway = new CustomerGateway(customerDataSource)
    customer = new Customer(
      'John Doe',
      new Document('11144477735'),
      'john@example.com',
      '1',
    )
  })

  it('should call dataSource.create with mapped DTO', async () => {
    await gateway.create(customer)
    const customerDto: CreateCustomerDto = {
      name: customer.getName(),
      document: customer.getDocument(),
      email: customer.getEmail(),
      id: customer.getId(),
    }
    expect(customerDataSource.create).toHaveBeenCalledWith(customerDto)
  })

  it('should return mapped Customer when found by document', async () => {
    customerDataSource.findByDocument = vi.fn().mockResolvedValue({
      id: '1',
      name: 'John Doe',
      document: '11144477735',
      email: 'john@example.com',
    })

    const result = await gateway.findByDocument('11144477735')
    expect(customerDataSource.findByDocument).toHaveBeenCalledWith(
      '11144477735',
    )
    expect(result).toStrictEqual(customer)
  })

  it('should return null when customer not found by document', async () => {
    customerDataSource.findByDocument = vi.fn().mockResolvedValue(null)
    const result = await gateway.findByDocument('notfound')
    expect(result).toBeNull()
  })

  it('should return mapped Customer when found by id', async () => {
    customerDataSource.findById = vi.fn().mockResolvedValue({
      id: '1',
      name: 'John Doe',
      document: '11144477735',
      email: 'john@example.com',
    })
    const result = await gateway.findById('1')
    expect(customerDataSource.findById).toHaveBeenCalledWith('1')
    expect(result).toStrictEqual(customer)
  })

  it('should return null when customer not found by id', async () => {
    customerDataSource.findById = vi.fn().mockResolvedValue(null)
    const result = await gateway.findById('notfound')
    expect(result).toBeNull()
  })
})
