/* eslint-disable @typescript-eslint/ban-types */
import { Router, Request, Response, NextFunction } from 'express'
import { ICustomerDataSource } from '@core/application/interfaces/repository/customer-data-source'
import { IOrderDataSource } from '@core/application/interfaces/repository/order-data-source'
import { OrderController } from '@infra/controllers/order-controller'
import { IProductDataSource } from '@core/application/interfaces/repository/product-data-source'

const orderRouter = Router()

orderRouter.post(
  '/',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const orderDataSource: IOrderDataSource =
        request.app.locals.orderDataSource
      const productDataSource: IProductDataSource =
        request.app.locals.productDataSource
      const customerDataSource: ICustomerDataSource =
        request.app.locals.customerDataSource

      const orderController = new OrderController(
        orderDataSource,
        productDataSource,
        customerDataSource,
      )

      const { customerDocument, items } = request.body

      const order = await orderController.createOrder({
        customerDocument,
        items,
      })

      response.status(201).json(order)
    } catch (error) {
      next(error)
    }
  },
)

orderRouter.get(
  '/',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const orderDataSource: IOrderDataSource =
        request.app.locals.orderDataSource
      const productDataSource: IProductDataSource =
        request.app.locals.productDataSource
      const customerDataSource: ICustomerDataSource =
        request.app.locals.customerDataSource

      const orderController = new OrderController(
        orderDataSource,
        productDataSource,
        customerDataSource,
      )

      const orders = await orderController.findAllOrders()

      response.json(orders)
    } catch (error) {
      next(error)
    }
  },
)

orderRouter.post(
  '/:orderId/payments',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const orderDataSource: IOrderDataSource =
        request.app.locals.orderDataSource
      const productDataSource: IProductDataSource =
        request.app.locals.productDataSource
      const customerDataSource: ICustomerDataSource =
        request.app.locals.customerDataSource

      const orderController = new OrderController(
        orderDataSource,
        productDataSource,
        customerDataSource,
      )

      await orderController.fakePayment(request.params.orderId)

      response.status(201).json()
    } catch (error) {
      next(error)
    }
  },
)

export default orderRouter
