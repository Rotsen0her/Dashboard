# 🚀 Guía de Deploy - VPS (Ubuntu)

Esta guía te ayudará a desplegar tu Dashboard en un VPS con Ubuntu.

## 📋 Prerrequisitos

- VPS con Ubuntu 20.04+ (DigitalOcean, Linode, AWS, etc.)
- Dominio apuntando al IP del VPS
- Acceso SSH al servidor

---

## 🛠️ PASO 1: Preparar el VPS

### Conectarse al VPS

```bash
ssh root@tu_ip_del_vps
```

### Actualizar sistema

```bash
apt update && apt upgrade -y
```

### Instalar Docker y Docker Compose

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
apt install docker-compose-plugin -y

# Verificar instalación
docker --version
docker compose version
```

### Instalar Git

```bash
apt install git -y
```

---

## 📦 PASO 2: Clonar el Proyecto

```bash
# Crear directorio para la app
mkdir -p /var/www
cd /var/www

# Clonar repositorio
git clone https://github.com/Rotsen0her/Dashboard.git
cd Dashboard
```

---

## 🔐 PASO 3: Configurar Variables de Entorno

```bash
# Copiar ejemplo
cp .env.example .env

# Editar con nano
nano .env
```

**Configurar con valores de PRODUCCIÓN:**

```env
# PostgreSQL (usar contraseñas FUERTES)
POSTGRES_USER=admin_prod
POSTGRES_PASSWORD=TuPasswordSuperSegura123!@#
POSTGRES_DB=wallpapersdb

# JWT Secret (generar uno ÚNICO)
JWT_SECRET=generar_con_comando_abajo

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

**Generar JWT Secret seguro:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Guardar con `Ctrl+X`, luego `Y`, luego `Enter`.

---

## 🌐 PASO 4: Configurar Dominio

### En tu proveedor de dominio (Namecheap, GoDaddy, etc.)

Agregar registro A:

```
Tipo: A
Host: @
Valor: IP_DE_TU_VPS
TTL: 3600
```

Para subdominio:

```
Tipo: A
Host: dashboard
Valor: IP_DE_TU_VPS
TTL: 3600
```

Esperar 5-30 minutos para propagación DNS.

---

## 🐳 PASO 5: Levantar con Docker

```bash
cd /var/www/Dashboard

# Construir y levantar todo
docker compose up -d --build

# Ver logs
docker compose logs -f

# Verificar contenedores
docker compose ps
```

Deberías ver 4 contenedores corriendo:
- wallpapers_backend
- wallpapers_frontend
- wallpapers_db
- wallpapers_nginx

---

## 🔒 PASO 6: Configurar SSL con Certbot

### Instalar Certbot

```bash
apt install certbot python3-certbot-nginx -y
```

### Obtener certificado SSL

```bash
# Detener nginx temporalmente
docker compose stop nginx

# Obtener certificado
certbot certonly --standalone -d tudominio.com -d www.tudominio.com

# Reiniciar nginx
docker compose start nginx
```

### Actualizar nginx.conf para HTTPS

Editar `nginx/nginx.conf`:

```nginx
events {}

http {
  # Redirigir HTTP a HTTPS
  server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    return 301 https://$server_name$request_uri;
  }

  # HTTPS
  server {
    listen 443 ssl http2;
    server_name tudominio.com www.tudominio.com;

    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;

    location /api/ {
      proxy_pass http://backend:4000/;
      rewrite ^/api/(.*)$ /$1 break;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
      proxy_pass http://frontend:80/;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }
}
```

### Actualizar docker-compose.yml

Agregar volumen de certificados:

```yaml
nginx:
  build: ./nginx
  container_name: wallpapers_nginx
  ports:
    - "80:80"
    - "443:443"
  depends_on:
    - frontend
    - backend
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    - /etc/letsencrypt:/etc/letsencrypt:ro  # ← Agregar esta línea
```

### Reiniciar nginx

```bash
docker compose restart nginx
```

### Renovación automática de certificados

```bash
# Editar crontab
crontab -e

# Agregar esta línea (renueva cada día a las 3am)
0 3 * * * certbot renew --quiet && docker compose -f /var/www/Dashboard/docker-compose.yml restart nginx
```

---

## 🔍 PASO 7: Verificar Deploy

### Probar endpoints

```bash
# Health check
curl https://tudominio.com

# Backend
curl https://tudominio.com/api/register -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"1234"}'
```

### Ver logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

---

## 🔄 PASO 8: Actualizar la Aplicación

```bash
cd /var/www/Dashboard

# Pull cambios
git pull origin main

# Reconstruir y reiniciar
docker compose down
docker compose up -d --build

# Ver logs
docker compose logs -f
```

---

## 🛡️ PASO 9: Seguridad Adicional (Recomendado)

### Configurar Firewall

```bash
# UFW (Ubuntu Firewall)
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

### Cambiar puerto SSH (opcional pero recomendado)

```bash
nano /etc/ssh/sshd_config

# Cambiar línea:
Port 22
# Por:
Port 2222

# Reiniciar SSH
systemctl restart sshd

# Actualizar firewall
ufw allow 2222/tcp
```

### Configurar fail2ban

```bash
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban
```

---

## 📊 PASO 10: Monitoreo (Opcional)

### Ver recursos del sistema

```bash
# CPU y RAM
htop

# Espacio en disco
df -h

# Logs de Docker
docker compose logs --tail=100
```

### Backups de Base de Datos

```bash
# Crear backup
docker exec wallpapers_db pg_dump -U admin_prod wallpapersdb > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker exec -i wallpapers_db psql -U admin_prod wallpapersdb < backup_20250107.sql
```

---

## 🆘 Troubleshooting

### Contenedor no inicia

```bash
docker compose logs nombre_contenedor
docker compose restart nombre_contenedor
```

### Error de permisos

```bash
chmod -R 755 /var/www/Dashboard
```

### Puerto ocupado

```bash
# Ver qué usa el puerto
netstat -tulpn | grep :80
```

### Base de datos no conecta

```bash
# Verificar que DB esté corriendo
docker compose ps db

# Ver logs de DB
docker compose logs db
```

---

## ✅ Checklist Final

- [ ] Docker y Docker Compose instalados
- [ ] Proyecto clonado en `/var/www/Dashboard`
- [ ] `.env` configurado con credenciales de producción
- [ ] Dominio apuntando al IP del VPS
- [ ] Todos los contenedores corriendo (`docker compose ps`)
- [ ] SSL configurado con Certbot
- [ ] HTTPS funcionando (https://tudominio.com)
- [ ] Backend respondiendo (https://tudominio.com/api/)
- [ ] Firewall configurado
- [ ] Renovación automática de SSL configurada

---

## 📞 Soporte

Si tienes problemas, revisa:
1. Logs: `docker compose logs -f`
2. Estado: `docker compose ps`
3. Dominio: `nslookup tudominio.com`

---

**🎉 ¡Felicidades! Tu Dashboard está en producción.**
