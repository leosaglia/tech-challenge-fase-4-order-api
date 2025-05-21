/* eslint-disable @typescript-eslint/no-var-requires */
const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('assert')
const axios = require('axios')

const produtosCadastrados = {}
let produtoPayload = {}
let resposta = {}

Given('que eu informo os dados de um novo produto', function (dataTable) {
  const data = dataTable.hashes()[0]
  produtoPayload = {
    name: data.nome,
    description: data.descricao,
    price: parseFloat(data.preco),
    category: data.categoria,
  }
})

When('eu envio a requisição de cadastro', async function () {
  resposta = await axios
    .post('http://localhost:3001/products', produtoPayload)
    .catch((e) => e.response)
})

Then('o produto deve ser criado com sucesso', function () {
  assert.strictEqual(resposta.status, 201)
})

Given(
  'que existe um produto cadastrado com nome {string} e categoria {string}',
  async function (nome, categoria) {
    const payload = {
      name: nome,
      description: 'Produto para teste',
      price: 5.99,
      category: categoria,
    }
    const res = await axios.post('http://localhost:3001/products', payload)
    produtosCadastrados[nome] = res.data
  },
)

When('eu solicito a listagem de produtos', async function () {
  resposta = await axios.get('http://localhost:3001/products')
})

When(
  'eu solicito a listagem de produtos da categoria {string}',
  async function (categoria) {
    resposta = await axios.get('http://localhost:3001/products', {
      params: { category: categoria },
    })
  },
)

Then('a resposta deve conter uma lista de produtos', function () {
  assert(Array.isArray(resposta.data))
  assert(resposta.data.length > 0)
})

Then('a lista deve conter o produto {string}', function (nome) {
  const found = resposta.data.find((p) => p.name === nome)
  assert(found)
})

Then('a lista não deve conter o produto {string}', function (nome) {
  const found = resposta.data.find((p) => p.name === nome)
  assert(!found)
})

Then(
  'a resposta deve conter apenas produtos da categoria {string}',
  function (categoria) {
    assert(resposta.data.every((p) => p.category === categoria))
  },
)

When(
  'eu altero o nome do produto {string} para {string} e o preço para {string}',
  async function (nomeAntigo, nomeNovo, precoNovo) {
    const produto = produtosCadastrados[nomeAntigo]
    const payload = {
      id: produto.id,
      name: nomeNovo,
      description: produto.description,
      price: parseFloat(precoNovo),
      category: produto.category,
    }
    resposta = await axios.put(
      `http://localhost:3001/products/${produto.id}`,
      payload,
    )
    produtosCadastrados[nomeNovo] = resposta.data
  },
)

Then('o produto deve ser atualizado com sucesso', function () {
  assert.strictEqual(resposta.status, 200)
})

When('eu solicito a remoção do produto {string}', async function (nome) {
  const produto = produtosCadastrados[nome]
  resposta = await axios.delete(`http://localhost:3001/products/${produto.id}`)
})

Then('o produto deve ser removido com sucesso', function () {
  assert.strictEqual(resposta.status, 204)
})

Then('a resposta deve conter o nome {string}', function (nome) {
  assert(resposta.data.name === nome)
})

Then('a resposta deve conter o preço {string}', function (preco) {
  assert(Number(resposta.data.price) === Number(preco))
})
