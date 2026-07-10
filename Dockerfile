# Usa un servidor web ultra ligero y rápido
FROM nginx:alpine

# Copia absolutamente todos los archivos (HTML, imágenes, etc.) a la carpeta de Nginx
COPY . /usr/share/nginx/html/

# Expone el puerto estándar de páginas web
EXPOSE 80