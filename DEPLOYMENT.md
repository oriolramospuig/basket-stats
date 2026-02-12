# 🚀 Guía de Despliegue - Basket Stats

## 📦 Requisitos
- Cuenta de GitHub
- Cuenta de Vercel (gratis)
- Cuenta de Turso (gratis)

---

## 1️⃣ Configurar Base de Datos Turso

### Instalar Turso CLI
```powershell
# En PowerShell como administrador
irm https://get.tur.so/install.ps1 | iex
```

### Crear cuenta y base de datos
```bash
# Registro (abre el navegador)
turso auth signup

# Crear base de datos
turso db create basket-stats

# Obtener URL de conexión
turso db show basket-stats --url

# Crear token
turso db tokens create basket-stats
```

**Guarda estos valores:**
- URL: `libsql://basket-stats-xxxxx.turso.io`
- Token: `eyJhbGc...`

### Inicializar tablas
```bash
# Conectarse a la BD
turso db shell basket-stats

# Copiar y pegar este SQL:
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shooting_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  session_date DATE NOT NULL,
  free_throws_made INTEGER DEFAULT 0,
  free_throws_attempted INTEGER DEFAULT 0,
  three_pointers_made INTEGER DEFAULT 0,
  three_pointers_attempted INTEGER DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON shooting_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON shooting_sessions(session_date);

# Salir con: .quit
```

---

## 2️⃣ Subir Código a GitHub

```bash
# En el directorio del proyecto
git init
git add .
git commit -m "Initial commit - Basket Stats App"

# Crear repositorio en GitHub (https://github.com/new)
# Luego conectar:
git remote add origin https://github.com/TU_USUARIO/basket-stats.git
git branch -M main
git push -u origin main
```

---

## 3️⃣ Desplegar en Vercel

### Opción A: Desde la Web (MÁS FÁCIL)

1. Ve a https://vercel.com/signup
2. Crea cuenta con GitHub
3. Click en "Add New Project"
4. Importa tu repositorio `basket-stats`
5. Configura las variables de entorno:

```
TURSO_DATABASE_URL = libsql://basket-stats-xxxxx.turso.io
TURSO_AUTH_TOKEN = eyJhbGc...tu-token-aqui
JWT_SECRET = genera-un-string-aleatorio-seguro-123456
NEXT_PUBLIC_APP_URL = https://tu-app.vercel.app
```

6. Click en "Deploy"
7. ¡Listo! Tu app estará en `https://tu-proyecto.vercel.app`

### Opción B: Desde la Terminal

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel

# Configurar variables de entorno
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_APP_URL

# Redesplegar con las variables
vercel --prod
```

---

## 4️⃣ Actualizar URL de la App

Después del primer despliegue, actualiza la variable en Vercel:

```
NEXT_PUBLIC_APP_URL = https://tu-proyecto-real.vercel.app
```

Y redesplega.

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push

# Vercel desplegará automáticamente
```

---

## 🎯 URLs Importantes

- **App en producción**: https://tu-proyecto.vercel.app
- **Dashboard Vercel**: https://vercel.com/dashboard
- **Dashboard Turso**: https://turso.tech/app

---

## ⚠️ Notas de Seguridad

1. **JWT_SECRET**: Usa un string aleatorio largo y único
2. **Nunca** subas `.env.local` a GitHub
3. Las variables de entorno en Vercel están seguras
4. Turso tiene límite gratuito de 500MB y 1 billón de lecturas/mes

---

## 📊 Verificar Despliegue

1. Visita tu URL de Vercel
2. Registra un usuario
3. Crea una sesión de tiro
4. Verifica que las estadísticas aparezcan

Si todo funciona, ¡tu app está pública! 🎉
