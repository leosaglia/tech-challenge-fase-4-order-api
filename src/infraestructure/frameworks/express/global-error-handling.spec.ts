import { describe, it, expect, vi, beforeEach } from 'vitest'
import globalErrorHandler from './global-error-handling'

describe('globalErrorHandler', () => {
  let req: any
  let res: any
  let next: any

  beforeEach(() => {
    req = {}
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }
    next = vi.fn()
  })

  it('should return 400 for InvalidProductError', () => {
    const err = { name: 'InvalidProductError', message: 'Invalid product' }
    globalErrorHandler(err as Error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Invalid product',
    })
  })

  it('should return 400 for InvalidCategoryError', () => {
    const err = { name: 'InvalidCategoryError', message: 'Invalid category' }
    globalErrorHandler(err as Error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Invalid category',
    })
  })

  it('should return 400 for InvalidCustomerError', () => {
    const err = { name: 'InvalidCustomerError', message: 'Invalid customer' }
    globalErrorHandler(err as Error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Invalid customer',
    })
  })

  it('should return 400 for InvalidDocumentError', () => {
    const err = { name: 'InvalidDocumentError', message: 'Invalid document' }
    globalErrorHandler(err as Error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Invalid document',
    })
  })

  it('should return 400 for InvalidOrderError', () => {
    const err = { name: 'InvalidOrderError', message: 'Invalid order' }
    globalErrorHandler(err as Error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Invalid order',
    })
  })

  it('should return 404 for ProductNotFoundError', () => {
    const err = { name: 'ProductNotFoundError', message: 'Product not found' }
    globalErrorHandler(err as Error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 404,
      message: 'Product not found',
    })
  })

  it('should return 404 for CustomerNotFoundError', () => {
    const err = { name: 'CustomerNotFoundError', message: 'Customer not found' }
    globalErrorHandler(err as Error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 404,
      message: 'Customer not found',
    })
  })

  it('should return 409 for CustomerAlreadyExistsError', () => {
    const err = {
      name: 'CustomerAlreadyExistsError',
      message: 'Customer already exists',
    }
    globalErrorHandler(err as Error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 409,
      message: 'Customer already exists',
    })
  })

  it('should return 500 for unknown error', () => {
    const err = { name: 'SomeOtherError', message: 'Something went wrong' }
    globalErrorHandler(err as Error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Something went wrong',
    })
  })
})
