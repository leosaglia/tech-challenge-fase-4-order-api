import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CustomerController } from './customer-controller'
import { CreateCustomerUseCase } from '@core/application/useCases/costumer/create-customer-use-case'
import { CustomerGateway } from '@infra/gateway/customer-gateway'
import { CustomerPresenter } from '@infra/presenters/CustomerPresenter'
import { CreateCustomerDto } from '@core/application/dtos/create-customer-dto'
import { Customer } from '@core/enterprise/entities/customer'
import { Document } from '@core/enterprise/valueObjects/document'

vi.mock('@core/application/useCases/costumer/create-customer-use-case', () => {
  return {
    CreateCustomerUseCase: vi.fn().mockImplementation(() => {
      return {
        execute: vi.fn().mockResolvedValue({
          customer: new Customer(
            'John Doe',
            new Document('111.444.777-35'),
            'john@example.com',
            '1',
          ),
        }),
      }
    }),
  }
})
vi.mock(
  '@core/application/useCases/costumer/identify-customer-by-document-use-case',
  () => {
    return {
      IdentifyCustomerByDocumentUseCase: vi.fn().mockImplementation(() => {
        return {
          execute: vi.fn().mockResolvedValue({
            customer: new Customer(
              'John Doe',
              new Document('111.444.777-35'),
              'john@example.com',
              '1',
            ),
          }),
        }
      }),
    }
  },
)

describe('CustomerController', () => {
  const mockCustomerDataSource = {
    create: vi.fn(),
    findByDocument: vi.fn(),
    findById: vi.fn(),
  }

  let controller: CustomerController

  beforeEach(() => {
    controller = new CustomerController(mockCustomerDataSource)
  })

  it('should create a customer and return a presenter', async () => {
    const dto: CreateCustomerDto = {
      name: 'John Doe',
      document: '111.444.777-35',
      email: 'john@example.com',
      id: '1',
    }
    const result = await controller.createCustomer(dto)

    expect(CreateCustomerUseCase).toHaveBeenCalledWith(
      expect.any(CustomerGateway),
    )

    expect(result).toStrictEqual(
      new CustomerPresenter('1', dto.name, '11144477735', dto.email),
    )
  })

  it('should find a customer by document and return a presenter', async () => {
    const document = '111.444.777-35'
    const result = await controller.findCustomerByDocument(document)

    expect(result).toStrictEqual(
      new CustomerPresenter('1', 'John Doe', '11144477735', 'john@example.com'),
    )
  })
})
