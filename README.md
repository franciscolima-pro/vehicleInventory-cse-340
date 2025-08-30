# 🚗 Vehicle Inventory MVC

![Node.js](https://img.shields.io/badge/node.js-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/express-000000.svg?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-336791.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![EJS](https://img.shields.io/badge/ejs-2C3E50.svg?style=for-the-badge&logo=ejs&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)</br>

Um sistema de inventário de veículos desenvolvido com **Node.js**, **Express** e **PostgreSQL**, seguindo a arquitetura **MVC**.  
O projeto permite gerenciar veículos por classificação e oferece diferentes níveis de acesso: visitantes, usuários autenticados e administradores.
DEMONSTRAÇÂO: https://drive.google.com/file/d/1_ZoZ2kLMINDjkqaYgXT3uJv3SnWcFIom/view?usp=drive_link
---

## ✨ Funcionalidades

- 🔎 **Visualização pública**
  - Qualquer visitante pode navegar pelas classificações e ver todos os veículos.

- 👤 **Conta de usuário**
  - Cadastro e login de usuários.
  - Possibilidade de **favoritar veículos** para consulta rápida.

- 🛠️ **Área administrativa**
  - Usuários com privilégio de administrador podem:
    - ➕ Adicionar novos veículos
    - ✏️ Editar informações existentes
    - ❌ Remover veículos

---

## 🛠️ Tecnologias e Dependências

- **Servidor & Frameworks**
  - [Express](https://expressjs.com/)
  - [Express EJS Layouts](https://www.npmjs.com/package/express-ejs-layouts)
  - [EJS](https://ejs.co/) (template engine)
  
- **Banco de Dados**
  - [PostgreSQL](https://www.postgresql.org/) com [pg](https://node-postgres.com/)
  - [connect-pg-simple](https://www.npmjs.com/package/connect-pg-simple) (sessões)

- **Autenticação & Segurança**
  - [bcryptjs](https://www.npmjs.com/package/bcryptjs) (hash de senhas)
  - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) (tokens JWT)
  - [express-session](https://www.npmjs.com/package/express-session)
  - [cookie-parser](https://www.npmjs.com/package/cookie-parser)

- **Validações & Middleware**
  - [express-validator](https://express-validator.github.io/)
  - [body-parser](https://www.npmjs.com/package/body-parser)
  - [connect-flash](https://www.npmjs.com/package/connect-flash)
  - [express-messages](https://www.npmjs.com/package/express-messages)
  - [dotenv](https://www.npmjs.com/package/dotenv)

---

## 📂 Estrutura do Projeto (MVC)

├── controllers/ # Lógica da aplicação
├── models/ # Regras de negócio e acesso ao BD
├── routes/ # Definição de rotas
├── views/ # Páginas EJS
├── public/ # Arquivos estáticos (css, js, imagens)
├── config/ # Configurações (DB, auth, etc.)
└── app.js # Ponto de entrada

---

## 🚀 Como rodar o projeto

### 1. Clonar o repositório
bash
- git clone https://github.com/seu-usuario/vehicle-inventory-mvc.git
- cd vehicle-inventory-mvc
### 2. Instalar dependências
- pnpm install
### 3. Configurar variáveis de ambiente
PORT=3000
DATABASE_URL=postgres://usuario:senha@localhost:5432/nomedobanco
JWT_SECRET=sua_chave_secreta
SESSION_SECRET=outra_chave_secreta
### 4. Rodar o servidor
- pnpm start
### 5. Acessar no navegador
- http://localhost:3000
  
- ---

👥 Perfis de Usuário

Visitante: pode navegar e visualizar todos os veículos por classificação.

Usuário autenticado: pode favoritar veículos.

Administrador: pode adicionar, editar e excluir veículos.
