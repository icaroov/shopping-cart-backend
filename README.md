# Sistema de Carrinho de Compras

Este projeto é um sistema de carrinho de compras desenvolvido com NodeJS. O objetivo é gerenciar carrinhos de compras com operações de adicionar, remover e listar produtos.

## Tecnologias Utilizadas

- **NodeJS**: Ambiente de execução de JavaScript.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática ao código.
- **Prisma**: ORM para interação com o banco de dados.
- **SQLite**: Banco de dados leve e fácil de usar.
- **Express**: Framework para construção de APIs em Node.js.
- **Zod**: Biblioteca para validação de esquemas de dados.
- **Pino**: Logger para Node.js.

## Requisitos

- NodeJS v18 ou superior
- npm

## Configuração do Ambiente

1. Clone o repositório:

   ```sh
   git clone git@github.com:icaroov/shopping-cart-backend.git
   cd shopping-cart-backend
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

   ```env
   DATABASE_URL="file:./dev.db"
   ```

4. Configure o Prisma:

   ```sh
   npx prisma migrate dev --name init
   npx prisma db seed
   npx prisma generate
   ```

5. Inicie o servidor de desenvolvimento:
   ```sh
   npm run dev
   ```

## Endpoints da API

### Criar um Novo Carrinho

- **URL**: `/cart`
- **Método**: `POST`
- **Input**:
  ```json
  {
    "sessionId": "sjtgdx356M2"
  }
  ```
- **Output**:
  ```json
  {
    "cart": {
      "id": "cdsvfg246T5",
      "sessionId": "sjtgdx356M2",
      "items": [],
      "total": 0,
      "createdAt": "2024-06-24T19:57:37.295Z",
      "updatedAt": "2024-06-24T19:57:37.295Z"
    }
  }
  ```

### Adicionar Item ao Carrinho

- **URL**: `/cart/items`
- **Método**: `POST`
- **Input**:
  ```json
  {
    "cartId": "cdsvfg246T5",
    "productId": "pmSjGCTfn8w"
  }
  ```
- **Output**:
  ```json
  {
    "cart": {
      "id": "cdsvfg246T5",
      "sessionId": "sjtgdx356M2",
      "items": [
        {
          "productId": "pmSjGCTfn8w",
          "quantity": 1,
          "price": 210
        }
      ],
      "total": 210,
      "createdAt": "2024-06-24T19:57:37.295Z",
      "updatedAt": "2024-06-24T19:57:37.295Z"
    }
  }
  ```

### Remover Item do Carrinho

- **URL**: `/cart/items`
- **Método**: `DELETE`
- **Input**:
  ```json
  {
    "cartId": "cdsvfg246T5",
    "productId": "pmSjGCTfn8w"
  }
  ```
- **Output**:
  ```json
  {
    "cart": {
      "id": "cdsvfg246T5",
      "sessionId": "sjtgdx356M2",
      "items": [],
      "total": 0,
      "createdAt": "2024-06-24T19:57:37.295Z",
      "updatedAt": "2024-06-24T19:57:37.295Z"
    }
  }
  ```

### Obter um Carrinho

- **URL**: `/cart/:id`
- **Método**: `GET`
- **Input**:
  ```json
  {
    "cartId": "cdsvfg246T5"
  }
  ```
- **Output**:
  ```json
  {
    "cart": {
      "id": "cdsvfg246T5",
      "sessionId": "sjtgdx356M2",
      "items": [],
      "total": 0,
      "createdAt": "2024-06-24T19:57:37.295Z",
      "updatedAt": "2024-06-24T19:57:37.295Z"
    }
  }
  ```

  ### Deletar um Carrinho

- **URL**: `/api/cart`
- **Método**: `DELETE`
- **Input**:
  ```json
  {
    "cartId": "cdsvfg246T5"
  }
  ```

## Scripts Disponíveis

- `dev`: Inicia o servidor de desenvolvimento.
- `build`: Cria a build de produção do projeto.
- `start`: Inicia o servidor de produção.
- `prisma migrate dev --name init`: Cria a primeira migração do banco de dados.
- `prisma db seed`: Popula o banco de dados com os produtos iniciais.