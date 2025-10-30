# 🧠 HESTIA - Back-End

---

## 🇧🇷 Documentação - Português

### 📌 Visão Geral

Este repositório contém o back-end da aplicação Interface HESTIA. A **Interface HESTIA** foi desenvolvida com o objetivo de facilitar a **criação de casos de teste** para o sistema original HESTIA. Devido ao grande volume de dados envolvidos, esse processo tornou-se desafiador. Este projeto visa **simplificar e agilizar** essa etapa, permitindo a geração de exemplos representativos de maneira mais eficiente e acessível.

---

### ⚙️ Requisitos

- Node.js instalado (versão 16+ recomendada)
- MySQL e SGBDR (opcional, mas recomendado)
- Python/Pip
- [Repositório do front-end clonado](https://github.com/ArturMota19/hestia-frontend)

---

### 🛠️ Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/ArturMota19/hestia-backend.git
   cd hestia-backend
   ```

2. Instale as dependências
   ```bash
   npm install
   ```

2.1. Instale as dependências do simulador
   ```bash
   cd hestia-sim
   pip install .
   ```

3. Crie o .env na raiz do projeto:
   ```
    #DB Connection
    DB_NAME=hestia
    DB_USER=root
    DB_PASSWORD=""
    DB_HOST=localhost
    PORT=3000
    JWT_SECRET="StringAleatoria"

    #User admin
    ADMIN_NAME="nome"
    ADMIN_EMAIL="email@email.com"
    ADMIN_PASSWORD="senha"
   ```

4. Banco de Dados:
    > 4.1: Crie uma database chamada "hestia" (igual ao .env)  
    > 4.2: Ajuste o .env com base nas suas configurações de banco (user, password, host...)

5. Inicie o servidor:
   ```bash
   node index.js
   ```

  ---

  ## 🇺🇸 Documentation - English

  ### 📌 Overview

  This repository contains the back-end of the HESTIA Interface application. The **HESTIA Interface** was developed to facilitate the **creation of test cases** for the original HESTIA system. Due to the large volume of data involved, this process became challenging. This project aims to **simplify and speed up** this step, allowing the generation of representative examples in a more efficient and accessible way.

  ---

  ### ⚙️ Requirements

  - Node.js installed (version 16+ recommended)
  - MySQL and RDBMS (optional, but recommended)
  - Python/Pip
  - [Front-end repository cloned](https://github.com/ArturMota19/hestia-frontend)

  ---

  ### 🛠️ Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/ArturMota19/hestia-backend.git
    cd hestia-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

2.1. Install simulator dependencies:
   ```bash
   cd hestia-sim
   pip install .
   ```

3. Create the .env file at the project root:
    ```
     #DB Connection
     DB_NAME=hestia
     DB_USER=root
     DB_PASSWORD=""
     DB_HOST=localhost
     PORT=3000
     JWT_SECRET="RandomString"

     #User admin
     ADMIN_NAME="name"
     ADMIN_EMAIL="email@email.com"
     ADMIN_PASSWORD="password"
    ```

4. Database:
     > 4.1: Create a database named "hestia" (same as in .env)  
     > 4.2: Adjust the .env file according to your database settings (user, password, host...)

5. Start the server:
    ```bash
    node index.js
    ```