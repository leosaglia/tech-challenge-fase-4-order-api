import { describe, it, expect, vi } from 'vitest'
import { Customer } from '@core/enterprise/entities/customer'
import { Document } from '@core/enterprise/valueObjects/document'
import { CreateCustomerUseCase } from './create-customer-use-case'
import { ICustomerGateway } from '@core/application/interfaces/gateway/customer-gateway-interface'
import {
  makeCreateCustomerDto,
  makeCustomer,
} from '@test/factories/customer-factory'
import { CustomerAlreadyExistsError } from '@core/enterprise/custom-exceptions/customer-already-exists'
import { InvalidDocumentError } from '@core/enterprise/custom-exceptions/invalid-document'
import { InvalidCustomerError } from '@core/enterprise/custom-exceptions/invalid-customer'

describe('CreateCustomerUseCase', () => {
  let sut: CreateCustomerUseCase
  let mockCustomerGateway: ICustomerGateway

  beforeEach(() => {
    mockCustomerGateway = {
      create: vi.fn().mockResolvedValue(null),
      findByDocument: vi.fn().mockResolvedValue(null),
      findById: vi.fn().mockResolvedValue(null),
    }

    sut = new CreateCustomerUseCase(mockCustomerGateway)
  })

  it('should create a new customer when document is unique', async () => {
    const createCustomerDto = makeCreateCustomerDto()

    const { customer } = await sut.execute(createCustomerDto)

    expect(customer).toBeInstanceOf(Customer)
    expect(customer.getName()).toBe(createCustomerDto.name)
    expect(customer.getEmail()).toBe(createCustomerDto.email)
    expect(customer.getDocument()).toBe(
      new Document(createCustomerDto.document).getValue(),
    )
    expect(mockCustomerGateway.findByDocument).toHaveBeenCalledWith(
      new Document(createCustomerDto.document).getValue(),
    )
    expect(mockCustomerGateway.create).toHaveBeenCalledWith(
      expect.any(Customer),
    )
  })

  it('should throw CustomerAlreadyExistsError when document is not unique', async () => {
    mockCustomerGateway.findByDocument = vi
      .fn()
      .mockResolvedValue(makeCustomer())

    sut = new CreateCustomerUseCase(mockCustomerGateway)
    const createCustomerDto = makeCreateCustomerDto()

    await expect(sut.execute(createCustomerDto)).rejects.toThrow(
      expect.objectContaining({
        message: 'Customer already exists.',
        name: CustomerAlreadyExistsError.name,
      }),
    )
    expect(mockCustomerGateway.findByDocument).toHaveBeenCalledWith(
      new Document(createCustomerDto.document).getValue(),
    )
    expect(mockCustomerGateway.create).not.toHaveBeenCalled()
  })

  const customerWithInvalidDocument = makeCreateCustomerDto({
    document: 'invalid_document',
  })

  const customerWithInvalidEmail = makeCreateCustomerDto({
    email: 'invalid_email',
  })

  const CustomerWithEmptyName = makeCreateCustomerDto({
    name: '',
  })

  it.each([
    [customerWithInvalidDocument, 'Invalid document.', InvalidDocumentError],
    [customerWithInvalidEmail, 'Invalid email.', InvalidCustomerError],
    [CustomerWithEmptyName, 'Invalid name.', InvalidCustomerError],
  ])(
    'should throw an error if pass invalid fields',
    async (invalidCustomer, excMessage, ErrorType) => {
      await expect(sut.execute(invalidCustomer)).rejects.toThrow(
        expect.objectContaining({
          message: excMessage,
          name: ErrorType.name,
        }),
      )
    },
  )
})
