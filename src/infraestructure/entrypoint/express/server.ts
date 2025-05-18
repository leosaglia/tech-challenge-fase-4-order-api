import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from './docs/swagger.json'
import routes from './routes'
import { IProductDataSource } from '@core/application/interfaces/repository/product-data-source'
import { ICustomerDataSource } from '@core/application/interfaces/repository/customer-data-source'
import { IOrderDataSource } from '@core/application/interfaces/repository/order-data-source'
import globalErrorHandler from './global-error-handling'
import SqsClient from '@infra/entrypoint/sqs/config/sqs.config'

export class TechChallengeAPI {
  static start(
    productDataSource: IProductDataSource,
    customerDataSource: ICustomerDataSource,
    orderDataSource: IOrderDataSource,
    sqsClient: SqsClient,
  ) {
    const app = express()
    app.use(express.json())

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

    app.use((req, res, next) => {
      req.app.locals.productDataSource = productDataSource
      req.app.locals.customerDataSource = customerDataSource
      req.app.locals.orderDataSource = orderDataSource
      req.app.locals.sqsClient = sqsClient
      next()
    })

    app.use(routes)
    app.use(globalErrorHandler)

    const port = process.env.PORT ?? 3001

    app.listen(port, () => {
      console.log(`Server started on port ${port}⚡`)
    })
  }
}
