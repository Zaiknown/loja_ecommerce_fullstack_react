# MinhaLoja - E-commerce Full-Stack


## 📖 Sobre o Projeto

MinhaLoja é uma aplicação de e-commerce completa, construída do zero com a stack MERN (MongoDB, Express, React, Node.js). Este projeto foi desenvolvido como uma peça central de portfólio para demonstrar competências em desenvolvimento full-stack, desde a interface do utilizador até à gestão de base de dados e autenticação.

**🔗 Link para o site ao vivo:** [https://loja-ecommerce-fullstack-react-s6rz.vercel.app/](https://loja-ecommerce-fullstack-react-s6rz.vercel.app/)

---

## ✨ Funcionalidades Principais

### Para Clientes:
-   Visualização de produtos com pesquisa e ordenação.
-   Página de detalhes para cada produto.
-   Carrinho de compras funcional com persistência de dados.
-   Sistema de registo e login de utilizadores.
-   Checkout seguro para finalizar pedidos.
-   Página de "Os Meus Pedidos" para ver o histórico de compras.

### Para Administradores:
-   Painel de administração protegido por autenticação e permissões.
-   Gestão completa de produtos (Criar, Ler, Atualizar, Apagar - CRUD).
-   Visualização de todos os pedidos feitos na loja.

---

## 🛠️ Tecnologias Utilizadas

-   **Front-end:** React, React Router, Axios, React Toastify, CSS puro.
-   **Back-end:** Node.js, Express.js.
-   **Base de Dados:** MongoDB (com Mongoose).
-   **Autenticação:** JSON Web Tokens (JWT), bcryptjs.
-   **Deployment:** Vercel (Front-end) e Render (Back-end).

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
-   Node.js (v18 ou superior)
-   npm
-   Git

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Zaiknown/loja_ecommerce_fullstack_react](https://github.com/Zaiknown/loja_ecommerce_fullstack_react)
    cd seu-repositorio
    ```

2.  **Configure o Back-end:**
    ```bash
    cd backend
    npm install
    # Crie um ficheiro .env e adicione as variáveis MONGODB_URI e JWT_SECRET
    ```

3.  **Configure o Front-end:**
    ```bash
    cd ../e-commerce # ou o nome da sua pasta de front-end
    npm install
    # Crie um ficheiro .env e adicione a variável VITE_API_URL
    ```

4.  **Execute a Aplicação:**
    * Num terminal, inicie o back-end: `cd backend && node server.js`
    * Noutro terminal, inicie o front-end: `cd e-commerce && npm run dev`

---

## 📝 Aprendizagens

Este projeto foi uma jornada incrível de aprendizagem, solidificando conceitos como estado global com React Context, criação de uma API RESTful, middlewares de autenticação, e o deployment de uma aplicação full-stack.