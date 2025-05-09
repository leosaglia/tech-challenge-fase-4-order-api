import { describe, it, expect } from 'vitest'
import { CustomerPresenter } from './CustomerPresenter'
import { Customer } from '@core/enterprise/entities/customer'
import { Document } from '@core/enterprise/valueObjects/document'

describe('CustomerPresenter', () => {
  it('should set properties correctly via constructor', () => {
    const presenter = new CustomerPresenter(
      '1',
      'Alice',
      '123456789',
      'alice@example.com',
    )
    expect(presenter).toMatchObject({
      id: '1',
      name: 'Alice',
      document: '123456789',
      email: 'alice@example.com',
    })
  })

  it('should present a Customer entity correctly', () => {
    const customer = new Customer(
      'John Doe',
      new Document('111.444.777-35'),
      'john.doe@example.com',
      '2',
    )

    const presenter = CustomerPresenter.present(customer)
    expect(presenter).toBeInstanceOf(CustomerPresenter)
    expect(presenter).toMatchObject({
      id: '2',
      name: 'John Doe',
      document: '11144477735',
      email: 'john.doe@example.com',
    })
  })
})
