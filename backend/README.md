# Backend - Wallpapers Dashboard

API REST para gestión de wallpapers con autenticación.

## 📦 Dependencias de Producción

```json
{
  "express": "^4.18.2",      // Framework web
  "cors": "^2.8.5",          // CORS middleware
  "pg": "^8.11.3",           // PostgreSQL client
  "bcrypt": "^5.1.1",        // Hash de contraseñas
  "jsonwebtoken": "^9.0.2",  // Autenticación JWT
  "dotenv": "^16.3.1",       // Variables de entorno
  "cloudinary": "^2.7.0",    // Almacenamiento de imágenes
  "multer": "^2.0.2"         // Upload de archivos
}
```

## 🚀 Instalación

### Desarrollo Local

```bash
npm install
npm run dev
```

### Producción

```bash
npm install --production
npm start
```

## 📋 Variables de Entorno Requeridas

Crear archivo `.env` en la raíz del backend:

```env
# PostgreSQL
POSTGRES_USER=tu_usuario
POSTGRES_PASSWORD=tu_password
POSTGRES_DB=wallpapersdb

# JWT
JWT_SECRET=tu_secreto_largo_y_aleatorio

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## 🐳 Deploy con Docker

El backend ya está dockerizado. Ver `Dockerfile` y `docker-compose.yml` en la raíz.

## 📡 Endpoints

### Autenticación
- `POST /register` - Registrar usuario
- `POST /login` - Iniciar sesión

### Wallpapers (requieren JWT)
- `POST /upload` - Subir wallpaper
- `GET /my-wallpapers` - Obtener wallpapers del usuario

## ⚙️ Configuración de Producción

### Requisitos
- Node.js 18+
- PostgreSQL 15+
- Cuenta de Cloudinary

### Cambios para Producción

1. Usar variable `PORT` desde entorno
2. Configurar CORS para tu dominio
3. Agregar rate limiting
4. Configurar logs
5. Health check endpoint

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- JWT para autenticación
- CORS configurado
- Variables sensibles en `.env`

## 📝 Notas

- El backend escucha en puerto 4000 por defecto
- Requiere conexión a PostgreSQL
- Las imágenes se suben a Cloudinary, no se almacenan localmente
