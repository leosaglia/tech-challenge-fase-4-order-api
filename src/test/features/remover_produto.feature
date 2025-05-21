# language: pt
Funcionalidade: Remoção de produto
  Como um administrador do fastfood
  Quero remover um produto do sistema
  Para que ele não seja mais vendido

  Contexto:
    Dado que existe um produto cadastrado com nome "Coca-Cola" e categoria "bebida"

  Cenário: Remover um produto com sucesso
    Quando eu solicito a remoção do produto "Coca-Cola"
    Então o produto deve ser removido com sucesso
