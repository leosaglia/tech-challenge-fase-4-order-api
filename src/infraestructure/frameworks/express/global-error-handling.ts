import { Request, Response, NextFunction } from 'express'

// Example of a global error handler
const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  switch (err.name) {
    case 'InvalidProductError':
    case 'InvalidCategoryError':
    case 'InvalidCustomerError':
    case 'InvalidDocumentError':
    case 'InvalidOrderError':
      res.status(400).json({ statusCode: 400, message: err.message })
      break
    case 'ProductNotFoundError':
    case 'CustomerNotFoundError':
      res.status(404).json({ statusCode: 404, message: err.message })
      break
    case 'CustomerAlreadyExistsError':
      res.status(409).json({ statusCode: 409, message: err.message })
      break
    default:
      res.status(500).json({ statusCode: 500, message: err.message })
      break
  }
}

export default globalErrorHandler
