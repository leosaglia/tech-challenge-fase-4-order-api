/* eslint-disable @typescript-eslint/ban-types */
import { Router, Request, Response, NextFunction } from 'express'
import { CustomerController } from '@infra/controllers/customer-controller'
import { ICustomerDataSource } from '@core/application/interfaces/repository/customer-data-source'

const customerRouter = Router()

customerRouter.post(
  '/',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const dataSource: ICustomerDataSource =
        request.app.locals.customerDataSource
      const customerController = new CustomerController(dataSource)

      const { name, document, email } = request.body

      const customer = await customerController.createCustomer({
        name,
        document,
        email,
      })

      response.status(201).json(customer)
    } catch (error) {
      next(error)
    }
  },
)

customerRouter.get(
  '/:document',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const dataSource: ICustomerDataSource =
        request.app.locals.customerDataSource
      const customerController = new CustomerController(dataSource)

      const { document } = request.params
      const customers =
        await customerController.findCustomerByDocument(document)

      response.json(customers)
    } catch (error) {
      next(error)
    }
  },
)

export default customerRouter
