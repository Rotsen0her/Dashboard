# ✅ Checklist para Colaboradores

## Antes de empezar

- [ ] Tengo Docker Desktop instalado y corriendo
- [ ] Tengo Git instalado
- [ ] Tengo Node.js 18+ (opcional, solo para desarrollo local)

## Setup inicial (primera vez)

- [ ] 1. Clonado el repositorio
  ```bash
  git clone https://github.com/Rotsen0her/Dashboard.git
  cd Dashboard
  ```

- [ ] 2. Creado cuenta en Cloudinary (https://cloudinary.com)
  - [ ] Obtuve Cloud Name
  - [ ] Obtuve API Key
  - [ ] Obtuve API Secret

- [ ] 3. Copiado `.env.example` a `.env`
  ```bash
  cp .env.example .env  # Linux/Mac
  Copy-Item .env.example .env  # Windows PowerShell
  ```

- [ ] 4. Configurado `.env` con mis credenciales
  - [ ] POSTGRES_PASSWORD (cambié por una segura)
  - [ ] JWT_SECRET (generé uno único)
  - [ ] CLOUDINARY_CLOUD_NAME
  - [ ] CLOUDINARY_API_KEY
  - [ ] CLOUDINARY_API_SECRET

- [ ] 5. Levantado Docker
  ```bash
  docker compose up -d --build
  ```

- [ ] 6. Verificado que todo funciona
  - [ ] `docker compose ps` muestra 4 contenedores corriendo
  - [ ] http://localhost:3000 carga el frontend
  - [ ] Puedo registrar un usuario
  - [ ] Puedo hacer login

## Workflow diario

### Inicio del día

- [ ] 1. Pull últimos cambios
  ```bash
  git pull origin main
  ```

- [ ] 2. Levantar Docker
  ```bash
  docker compose up -d
  ```

- [ ] 3. Ver logs si algo falla
  ```bash
  docker compose logs -f
  ```

### Durante desarrollo

#### Trabajando en Frontend
- [ ] Editar archivos en `frontend/src/`
- [ ] Reconstruir frontend si es necesario:
  ```bash
  docker compose up -d --build frontend
  ```

#### Trabajando en Backend
- [ ] Editar archivos en `backend/`
- [ ] Reconstruir backend si es necesario:
  ```bash
  docker compose up -d --build backend
  ```

### Antes de hacer commit

- [ ] 1. Verificar que todo funciona
  ```bash
  docker compose ps
  ```

- [ ] 2. No commitear archivo `.env` (ya está en .gitignore)

- [ ] 3. Hacer commit y push
  ```bash
  git add .
  git commit -m "Descripción de cambios"
  git push origin tu-rama
  ```

### Final del día

- [ ] Detener Docker (opcional)
  ```bash
  docker compose down
  ```

## Comandos útiles

```bash
# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend
docker compose logs -f frontend

# Reiniciar un servicio
docker compose restart backend

# Reconstruir todo desde cero
docker compose down -v
docker compose up -d --build

# Conectarse a la base de datos
docker exec -it wallpapers_db psql -U wallpapers_admin -d wallpapersdb

# Ver qué contenedores están corriendo
docker compose ps

# Detener todo
docker compose down
```

## Problemas comunes

### ❌ "Port already in use"
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4000 | xargs kill -9
```

### ❌ Cambios no se reflejan
```bash
# Reconstruir el servicio
docker compose up -d --build frontend
```

### ❌ Error de conexión a base de datos
```bash
# Reiniciar todo
docker compose restart
```

### ❌ Frontend no carga después de cambios
```bash
# Limpiar y reconstruir
docker compose down
docker compose up -d --build
```

## ¿Necesitas ayuda?

1. Lee el [README.md](README.md) completo
2. Revisa los logs: `docker compose logs -f`
3. Pregunta en el equipo
4. Abre un issue en GitHub

## Archivos importantes

- `README.md` - Documentación completa
- `.env.example` - Plantilla de variables de entorno
- `.gitignore` - Archivos que NO se suben a Git
- `docker-compose.yml` - Configuración de servicios
- `QUICKSTART.md` - Guía rápida para Windows
