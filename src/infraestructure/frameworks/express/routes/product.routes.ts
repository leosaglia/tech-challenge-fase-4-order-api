/* eslint-disable @typescript-eslint/ban-types */
import { Router, Request, Response, NextFunction } from 'express'
import { IProductDataSource } from '@core/application/interfaces/repository/product-data-source'
import { ProductController } from '@infra/controllers/product-controller'

const productRouter = Router()

interface ProductQueryParams {
  category?: string
}

productRouter.post(
  '/',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const dataSource: IProductDataSource = request.app.locals.productDataSource
      const productController = new ProductController(dataSource)

      const { name, description, price, category } = request.body

      const product = await productController.createProduct({
        name,
        description,
        price,
        category,
      })

      response.status(201).json(product)
    } catch (error) {
      next(error)
    }
  },
)

productRouter.get(
  '/',
  async (
    request: Request<{}, {}, {}, ProductQueryParams>,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const dataSource: IProductDataSource = request.app.locals.productDataSource
      const productController = new ProductController(dataSource)

      const { category } = request.query

      const product = await productController.getAllProductsByCategory(category)

      response.json(product)
    } catch (error) {
      next(error)
    }
  },
)

productRouter.put(
  '/:id',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const dataSource: IProductDataSource = request.app.locals.productDataSource
      const productController = new ProductController(dataSource)

      const { id } = request.params
      const { name, description, price, category } = request.body

      const product = await productController.updateProduct({
        id,
        name,
        description,
        price,
        category,
      })

      response.json(product)
    } catch (error) {
      next(error)
    }
  },
)

productRouter.delete(
  '/:id',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const dataSource: IProductDataSource = request.app.locals.productDataSource
      const productController = new ProductController(dataSource)

      const { id } = request.params

      await productController.deleteProduct(id)

      response.status(204).send()
    } catch (error) {
      next(error)
    }
  },
)

export default productRouter
