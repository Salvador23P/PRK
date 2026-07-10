# === ETAPA 1: Dependencias y Compilación ===
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copiar archivos de configuración de dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código del frontend y compilar
COPY . .
RUN npm run build

# === ETAPA 2: Imagen de producción ligera ===
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Exponer el puerto correcto para Next.js
EXPOSE 3000

# Copiar los archivos públicos y los estáticos optimizados
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next/static ./.next/static

# Copiar el servidor optimizado generado por el modo standalone
COPY --from=builder /usr/src/app/.next/standalone ./

# Comando para arrancar el servidor standalone de Next.js
CMD ["node", "server.js"]