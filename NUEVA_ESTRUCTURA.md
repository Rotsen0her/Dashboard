# 🎨 Dashboard de Wallpapers - Nueva Estructura

## 📋 Características Implementadas

### ✨ Interfaz Completa
- **Layout con Menú Lateral**: Menú desplegable con botón hamburguesa (3 rayas)
- **4 Secciones Principales**:
  - 🏠 **Inicio**: Vista estilo Pinterest con wallpapers de todos los usuarios
  - ⬆️ **Subir Wallpaper**: Interfaz para subir nuevas imágenes
  - 🖼️ **Mis Wallpapers**: Galería personal con opciones de descarga y eliminación
  - ⭐ **Favoritos**: Colección de wallpapers marcados como favoritos

### 👤 Menú de Usuario
Al hacer click en el avatar del usuario (esquina superior derecha), se despliega un menú con:
- ✏️ Cambiar Usuario
- 🔑 Cambiar Contraseña
- 🗑️ Borrar Cuenta
- 🚪 Cerrar Sesión

### 🎨 Diseño
- Tema oscuro con gradientes morados
- Diseño responsive
- Animaciones suaves
- Grid estilo Pinterest/Masonry
- Efectos hover en las imágenes

## 🚀 Componentes Creados

### Frontend
- `Layout.jsx` - Layout principal con menú lateral
- `Home.jsx` - Página de inicio (estilo Pinterest)
- `UploadWallpaper.jsx` - Página para subir wallpapers
- `MyWallpapers.jsx` - Página de wallpapers personales
- `Favorites.jsx` - Página de favoritos
- `App.jsx` - Actualizado para manejar navegación

### Backend (Nuevos Endpoints)
- `GET /wallpapers` - Obtener todos los wallpapers con info de usuario
- `DELETE /wallpaper` - Eliminar un wallpaper propio
- `POST /favorites` - Agregar wallpaper a favoritos
- `DELETE /favorites` - Quitar wallpaper de favoritos
- `GET /favorites` - Obtener lista de favoritos

### Base de Datos
- Nueva tabla `favorites` para almacenar wallpapers favoritos
- Índices optimizados para consultas

## 🎯 Modo Diseño

El proyecto incluye un **Modo Diseño** (ya estaba implementado) que permite navegar entre las diferentes vistas sin necesidad de autenticación.

Para activarlo/desactivarlo:
```javascript
// En frontend/src/App.jsx
const DESIGN_MODE = true; // true para diseño, false para producción
```

## 🔧 Cómo Usar

### Desarrollo Local
```bash
# Levantar los servicios con Docker
docker-compose up --build

# Acceder a:
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
```

### Navegación en la App
1. **Login/Register**: Autenticación de usuarios
2. **Sidebar**: Click en el botón hamburguesa (☰) para desplegar el menú
3. **Navegación**: 
   - Inicio: Ver todos los wallpapers
   - Subir: Agregar nuevos wallpapers
   - Mis Wallpapers: Gestionar tus wallpapers
   - Favoritos: Ver wallpapers favoritos
4. **Usuario**: Click en el avatar para opciones de cuenta

### Funcionalidades por Página

#### 🏠 Inicio
- Grid estilo Pinterest con wallpapers de todos los usuarios
- Botón de favorito (estrella) en cada imagen
- Muestra el nombre del usuario que subió cada wallpaper
- Diseño responsive tipo masonry

#### ⬆️ Subir Wallpaper
- Drag & drop o click para seleccionar imagen
- Preview antes de subir
- Validación de formato y tamaño (máx. 10MB)
- Indicador de progreso durante la carga
- Consejos para subir wallpapers de calidad

#### 🖼️ Mis Wallpapers
- Grid con todos tus wallpapers
- Botón de descarga en cada imagen
- Botón de eliminación con confirmación
- Contador de wallpapers

#### ⭐ Favoritos
- Grid estilo masonry con favoritos
- Botón para quitar de favoritos
- Botón de descarga
- Muestra info del usuario original
- Contador de favoritos

## 🔐 Seguridad

- Autenticación con JWT
- Passwords hasheados con bcrypt
- Middleware de autenticación en todos los endpoints protegidos
- Validación de ownership para eliminar wallpapers

## 📱 Responsive

La aplicación es completamente responsive:
- Mobile: Menú lateral colapsable
- Tablet: Grid de 2-3 columnas
- Desktop: Grid de 4 columnas
- Sidebar se esconde automáticamente en móviles

## 🎨 Tecnologías

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Base de Datos**: PostgreSQL
- **Storage**: Cloudinary
- **Containerización**: Docker

## 📝 Notas

- El menú lateral se cierra automáticamente al seleccionar una opción
- Las imágenes tienen lazy loading para mejor performance
- El grid tipo Pinterest se ajusta automáticamente según el contenido
- Los favoritos son persistentes y específicos por usuario
