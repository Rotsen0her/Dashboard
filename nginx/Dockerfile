FROM nginx:1.25-alpine

# Copiar la configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puertos
EXPOSE 80 443

# Comando por defecto de nginx
CMD ["nginx", "-g", "daemon off;"]
