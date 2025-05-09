import { Decimal } from 'decimal.js'

export interface EditProductDto {
  id: string
  name: string
  price: Decimal
  description: string
  category: string
}
