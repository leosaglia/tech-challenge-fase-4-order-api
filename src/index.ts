import PrismaCustomerRepository from '@infra/database/postgress/prisma-customer-repository'
import PrismaOrderRepository from '@infra/database/postgress/prisma-order-repository'
import { PrismaProductRepository } from '@infra/database/postgress/prisma-product-repository'
import { TechChallengeAPI } from '@infra/frameworks/express/server'
import { PrismaService } from '@infra/frameworks/prisma/prisma.service'

const productDataSource = new PrismaProductRepository(new PrismaService())
const customerDataSource = new PrismaCustomerRepository(new PrismaService())
const orderDataSource = new PrismaOrderRepository(new PrismaService())

TechChallengeAPI.start(productDataSource, customerDataSource, orderDataSource)
