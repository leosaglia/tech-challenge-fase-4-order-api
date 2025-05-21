# language: pt
Funcionalidade: Listagem de produtos
  Como um usuário do fastfood
  Quero visualizar os produtos cadastrados
  Para escolher o que comprar

  Contexto:
    Dado que existe um produto cadastrado com nome "Coca-Cola" e categoria "bebida"
    E que existe um produto cadastrado com nome "Batata Frita" e categoria "acompanhamento"

  Cenário: Listar todos os produtos
    Quando eu solicito a listagem de produtos
    Então a resposta deve conter uma lista de produtos
    E a lista deve conter o produto "Coca-Cola"
    E a lista deve conter o produto "Batata Frita"

  Cenário: Listar produtos por categoria
    Quando eu solicito a listagem de produtos da categoria "bebida"
    Então a resposta deve conter apenas produtos da categoria "bebida"
    E a lista deve conter o produto "Coca-Cola"
    E a lista não deve conter o produto "Batata Frita"
