# Usa un servidor web ultra ligero y rápido
FROM nginx:alpine

# Copia tu archivo HTML directamente a la carpeta pública de Nginx
COPY "index (3).html" /usr/share/nginx/html/index.html

# Expone el puerto estándar de páginas web
EXPOSE 80
