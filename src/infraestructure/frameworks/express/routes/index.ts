import { Router } from 'express'
import productRouter from './product.routes'
import customerRouter from './customer.routes'
import orderRouter from './order.routes'
import healthRouter from './health.routes'

const routes = Router()

routes.use('/products', productRouter)
routes.use('/customers', customerRouter)
routes.use('/orders', orderRouter)
routes.use('/health', healthRouter)

export default routes
