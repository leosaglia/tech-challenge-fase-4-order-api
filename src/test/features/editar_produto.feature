# language: pt
Funcionalidade: Edição de produto
  Como um administrador do fastfood
  Quero editar um produto existente
  Para corrigir informações ou atualizar preços

  Contexto:
    Dado que existe um produto cadastrado com nome "Coca-Cola" e categoria "bebida"

  Cenário: Editar um produto com sucesso
    Quando eu altero o nome do produto "Coca-Cola" para "Coca-Cola Zero" e o preço para "6.99"
    Então o produto deve ser atualizado com sucesso
    E a resposta deve conter o nome "Coca-Cola Zero"
    E a resposta deve conter o preço "6.99"
