import { describe, it, expect, vi } from 'vitest'
import { Document } from '@core/enterprise/valueObjects/document'
import { Customer } from '@core/enterprise/entities/customer'
import { IdentifyCustomerByDocumentUseCase } from './identify-customer-by-document-use-case'
import { ICustomerGateway } from '@core/application/interfaces/gateway/customer-gateway-interface'
import { CustomerNotFoundError } from '@core/enterprise/custom-exceptions/customer-not-found'
import { InvalidDocumentError } from '@core/enterprise/custom-exceptions/invalid-document'

describe('IdentifyCustomerByDocumentUseCase', () => {
  let sut: IdentifyCustomerByDocumentUseCase
  let mockCustomerGateway: ICustomerGateway

  beforeEach(() => {
    mockCustomerGateway = {
      create: vi.fn().mockResolvedValue(undefined),
      findByDocument: vi.fn().mockResolvedValue(null),
      findById: vi.fn().mockResolvedValue(undefined),
    }

    sut = new IdentifyCustomerByDocumentUseCase(mockCustomerGateway)
  })

  it('should return customer when found by document', async () => {
    const customer = new Customer(
      'John Doe',
      new Document('111.444.777-35'),
      'john@example.com',
    )
    mockCustomerGateway.findByDocument = vi.fn().mockResolvedValue(customer)

    sut = new IdentifyCustomerByDocumentUseCase(mockCustomerGateway)
    const document = '111.444.777-35'

    const response = await sut.execute(document)

    expect(response.customer).toEqual(customer)
    expect(mockCustomerGateway.findByDocument).toHaveBeenCalledWith(
      '11144477735',
    )
  })

  it('should throw CustomerNotFoundError when customer is not found', async () => {
    const document = '111.444.777-35'

    await expect(sut.execute(document)).rejects.toThrow(
      expect.objectContaining({
        message: 'Customer not created',
        name: CustomerNotFoundError.name,
      }),
    )
    expect(mockCustomerGateway.findByDocument).toHaveBeenCalledWith(
      '11144477735',
    )
  })

  it('should throw InvalidDocumentError when the document is invalid', async () => {
    const document = 'invalid document'

    await expect(sut.execute(document)).rejects.toThrow(
      expect.objectContaining({
        message: 'Invalid document.',
        name: InvalidDocumentError.name,
      }),
    )
    expect(mockCustomerGateway.findByDocument).not.toHaveBeenCalled()
  })
})
