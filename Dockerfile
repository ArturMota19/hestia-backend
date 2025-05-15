# Usa uma imagem base do Node.js
FROM node:18

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos da aplicação para o contêiner
COPY package.json package-lock.json ./
COPY . ./

# Instala as dependências
RUN npm install

# Expõe a porta usada pelo servidor
EXPOSE 3000

# Comando para iniciar o backend
CMD ["npm", "run", "start"]
