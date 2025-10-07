# 🎨 MODO DISEÑO - Instrucciones

## ⚠️ IMPORTANTE: Cambios temporales para diseño colaborativo

Este proyecto tiene configuraciones temporales para facilitar el diseño sin necesidad de backend/BD.

---

## 📝 Pasos para DESACTIVAR el modo diseño (volver a producción):

### 1. **Archivo: `frontend/src/App.jsx`**
```javascript
// Cambiar esta línea:
const DESIGN_MODE = true;

// Por esta:
const DESIGN_MODE = false;
```

### 2. **Archivo: `frontend/src/Preview.jsx`** ❌ ELIMINAR
Este archivo es solo para referencia y no se usa en producción.
```bash
# Eliminar el archivo:
rm frontend/src/Preview.jsx
```

### 3. **Verificar que funcione con backend:**
```bash
# Levantar todos los servicios:
docker-compose up -d

# Acceder a:
http://localhost       # Nginx (producción)
http://localhost:3000  # Frontend directo
http://localhost:4000  # Backend API
```

---

## ✅ Checklist antes de desplegar a producción:

- [ ] `DESIGN_MODE = false` en `frontend/src/App.jsx`
- [ ] Eliminar archivo `frontend/src/Preview.jsx` (opcional)
- [ ] Probar login/register con backend corriendo
- [ ] Probar subida de imágenes a Cloudinary
- [ ] Reconstruir imagen de Docker: `docker-compose build frontend`
- [ ] Hacer commit de los cambios finales
- [ ] Push al repositorio

---

## 🔧 Configuración actual para Live Share:

**Archivo: `frontend/vite.config.js`**
```javascript
server: {
  host: true,  // ⚠️ Mantener esto para desarrollo colaborativo
  port: 5173,
  strictPort: true,
}
```

**Nota:** Esta configuración es segura y útil incluso en desarrollo normal, así que puedes dejarla.

---

## 🚀 Comandos útiles:

### Modo Diseño (desarrollo sin backend):
```bash
cd frontend
npm run dev
# Abrir: http://localhost:5173
```

### Modo Producción (con Docker):
```bash
docker-compose down
docker-compose build frontend
docker-compose up -d
# Abrir: http://localhost
```

---

## 📌 Resumen de archivos temporales:

| Archivo | Estado | Acción |
|---------|--------|--------|
| `frontend/src/App.jsx` | Modificado | Cambiar `DESIGN_MODE = false` |
| `frontend/src/Preview.jsx` | Temporal | Eliminar (opcional) |
| `frontend/vite.config.js` | Modificado | ✅ Mantener (es útil) |
| `MODO_DISEÑO.md` | Documentación | Eliminar después de producción |

---

**Fecha de creación:** 7 de octubre, 2025  
**Propósito:** Facilitar diseño colaborativo con Live Share sin necesidad de backend/BD corriendo
