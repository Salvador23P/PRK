# 1. Usar una imagen oficial de Node.js
FROM node:20-alpine

# 2. Crear el directorio de la app
WORKDIR /usr/src/app

# 3. Copiar archivos de empaquetado e instalar dependencias
COPY package*.json ./
RUN npm install --production

# 4. Copiar el resto del código fuente
COPY . .

# 5. Exponer el puerto genérico
EXPOSE 3001

# 6. Comando para arrancar la aplicación
CMD [ "node", "server.js" ]