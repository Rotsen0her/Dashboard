# 🚀 Guía Rápida - Windows

## Prerrequisitos

- [ ] Docker Desktop instalado
- [ ] Git instalado
- [ ] Cuenta de Cloudinary (gratis)

## Pasos Rápidos

### 1. Clonar
```powershell
git clone https://github.com/Rotsen0her/Dashboard.git
cd Dashboard
```

### 2. Configurar .env
```powershell
# Copiar archivo de ejemplo
Copy-Item .env.example .env

# Editar con tu editor favorito
notepad .env
```

**Configurar en .env:**
1. Crear cuenta en https://cloudinary.com
2. Copiar Cloud Name, API Key y API Secret
3. Generar JWT Secret:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### 3. Levantar todo
```powershell
docker compose up -d --build
```

### 4. Verificar
```powershell
# Ver contenedores
docker compose ps

# Abrir en navegador
start http://localhost:3000
```

### 5. Probar backend
```powershell
# Registrar usuario
Invoke-RestMethod -Uri "http://localhost:4000/register" -Method Post -ContentType "application/json" -Body '{"username":"test","password":"1234"}'

# Login
Invoke-RestMethod -Uri "http://localhost:4000/login" -Method Post -ContentType "application/json" -Body '{"username":"test","password":"1234"}'
```

## ✅ URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Nginx: http://localhost

## 🛑 Detener

```powershell
docker compose down
```

## 🧹 Limpiar todo

```powershell
# Detener y borrar volúmenes (¡Borra la BD!)
docker compose down -v
```
