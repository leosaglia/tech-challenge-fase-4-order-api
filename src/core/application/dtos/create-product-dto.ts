import { Decimal } from 'decimal.js'

export interface CreateProductDto {
  id?: string
  name: string
  price: Decimal
  description: string
  category: string
}
