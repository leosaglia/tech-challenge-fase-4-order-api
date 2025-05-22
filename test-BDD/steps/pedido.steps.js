/* eslint-disable @typescript-eslint/no-var-requires */
const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('assert')
const axios = require('axios')

let pedidoPayload = {}
let respostaPedido = {}
let idProduto = ''

Given('que existe um produto cadastrado', async function () {
  const payload = {
    name: 'Coca-Cola',
    description: 'Produto para pedido',
    price: 10.0,
    category: 'bebida',
  }
  const res = await axios.post('http://localhost:3001/products', payload)
  idProduto = res.data.id
})

Given('que informo os dados de um novo pedido', function (dataTable) {
  const data = dataTable.hashes()[0]
  // Substitui {id_produto} pelo id real do produto cadastrado
  const items = JSON.parse(data.items.replace('{id_produto}', idProduto))
  pedidoPayload = {
    items,
  }
})

When('eu envio a requisição de cadastro de pedido', async function () {
  respostaPedido = await axios
    .post('http://localhost:3001/orders', pedidoPayload)
    .catch((e) => e.response)
})

Then('o pedido deve ser criado com sucesso', function () {
  assert.strictEqual(respostaPedido.status, 201)
})

Then('a resposta deve conter o id do pedido', function () {
  assert.ok(respostaPedido.data.id)
})

Then('a resposta deve conter os itens do pedido', function () {
  assert.ok(Array.isArray(respostaPedido.data.items))
  assert.ok(respostaPedido.data.items.length > 0)
})
