# Etapa de build
FROM node:18.20.4 AS build

# Definir o diretório de trabalho no contêiner
WORKDIR /app

# Copiar os arquivos de configuração do npm
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar todo o projeto para o diretório de trabalho do contêiner
COPY . .

# Executar o build para produção
RUN npm run build -- --prod

# Etapa de produção
FROM nginx:alpine

# Copiar os arquivos compilados para o diretório do Nginx
COPY --from=build /app/www /usr/share/nginx/html

# Expondo a porta 80
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
