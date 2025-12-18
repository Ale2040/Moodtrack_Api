# 🚂 Guía Completa: Desplegar en Railway

## 📋 Tabla de Contenidos
1. [¿Qué es Railway?](#qué-es-railway)
2. [Requisitos Previos](#requisitos-previos)
3. [Paso 1: Crear Cuenta](#paso-1-crear-cuenta)
4. [Paso 2: Preparar el Código](#paso-2-preparar-el-código)
5. [Paso 3: Subir a GitHub](#paso-3-subir-a-github)
6. [Paso 4: Crear Proyecto en Railway](#paso-4-crear-proyecto-en-railway)
7. [Paso 5: Configurar Base de Datos](#paso-5-configurar-base-de-datos)
8. [Paso 6: Configurar Variables de Entorno](#paso-6-configurar-variables-de-entorno)
9. [Paso 7: Obtener la URL](#paso-7-obtener-la-url)
10. [Paso 8: Actualizar la App Flutter](#paso-8-actualizar-la-app-flutter)
11. [Paso 9: Probar la Conexión](#paso-9-probar-la-conexión)
12. [Solución de Problemas](#solución-de-problemas)

---

## ¿Qué es Railway?

Railway es una plataforma en la nube que permite desplegar aplicaciones de forma sencilla. Es **gratis** para empezar y perfecto para proyectos pequeños y medianos.

**Ventajas:**
- ✅ Gratis para empezar (plan gratuito generoso)
- ✅ Muy fácil de usar
- ✅ Despliegue automático desde GitHub
- ✅ Base de datos PostgreSQL incluida
- ✅ HTTPS automático
- ✅ Sin configuración complicada

---

## Requisitos Previos

Antes de empezar, necesitas:

1. ✅ **Cuenta de GitHub** (gratis)
   - Si no tienes: https://github.com/join

2. ✅ **Git instalado** (ya lo tienes)

3. ✅ **Código de tu API** (ya lo tienes en `MoodTrack_API`)

---

## Paso 1: Crear Cuenta en Railway

### 1.1. Ir a Railway
- Abre tu navegador y ve a: **https://railway.app/**

### 1.2. Iniciar Sesión
- Haz clic en **"Start a New Project"** o **"Login"**
- Selecciona **"Login with GitHub"**
- Autoriza Railway para acceder a tu cuenta de GitHub

### 1.3. Verificar Cuenta
- Una vez dentro, verás el dashboard de Railway
- Si es tu primera vez, verás un mensaje de bienvenida

---

## Paso 2: Preparar el Código

### 2.1. Verificar que server.js esté listo

Abre `MoodTrack_API/server.js` y verifica que tenga:

```javascript
// Puerto dinámico
const puerto = process.env.PORT || 3000;

// Base de datos con DATABASE_URL
let baseDatos;
if (process.env.DATABASE_URL) {
  baseDatos = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  // Configuración local...
}

// Escuchar en 0.0.0.0
app.listen(puerto, '0.0.0.0', () => {
  // ...
});
```

✅ **Ya está actualizado** - El código ya tiene estos cambios.

### 2.2. Verificar package.json

Abre `MoodTrack_API/package.json` y verifica que tenga:

```json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

✅ **Ya está actualizado**.

### 2.3. Crear archivo .gitignore (si no existe)

Crea o verifica `MoodTrack_API/.gitignore`:

```
node_modules/
.env
.DS_Store
*.log
```

---

## Paso 3: Subir a GitHub

### 3.1. Inicializar Git (si no está inicializado)

Abre PowerShell en la carpeta `MoodTrack_API`:

```powershell
cd C:\Users\Alejandro\AndroidStudioProjects\MoodTrack_API
git init
```

### 3.2. Crear repositorio en GitHub

1. Ve a https://github.com/new
2. **Repository name**: `MoodTrack_API` (o el nombre que prefieras)
3. **Description**: "API para MoodTrack - Seguimiento de Estados de Ánimo"
4. Selecciona **"Public"** o **"Private"** (puedes cambiarlo después)
5. **NO marques** "Add a README file" (ya tienes código)
6. Haz clic en **"Create repository"**

### 3.3. Subir el código

En PowerShell, ejecuta:

```powershell
# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Primera versión de la API"

# Agregar el repositorio remoto (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/MoodTrack_API.git

# Subir el código
git branch -M main
git push -u origin main
```

**Nota**: Si te pide credenciales, usa un **Personal Access Token** de GitHub:
1. Ve a: https://github.com/settings/tokens
2. "Generate new token" → "Generate new token (classic)"
3. Selecciona scope: `repo`
4. Copia el token y úsalo como contraseña cuando Git lo pida

---

## Paso 4: Crear Proyecto en Railway

### 4.1. Nuevo Proyecto

1. En Railway, haz clic en **"New Project"** (botón grande en el dashboard)

2. Selecciona **"Deploy from GitHub repo"**

3. Si es la primera vez, autoriza Railway para acceder a tus repositorios

4. Busca y selecciona tu repositorio `MoodTrack_API`

5. Railway comenzará a desplegar automáticamente

### 4.2. Ver el Proceso de Despliegue

- Verás un log en tiempo real del despliegue
- Railway detectará automáticamente que es Node.js
- Instalará las dependencias (`npm install`)
- Iniciará el servidor (`npm start`)

⏱️ **Tiempo estimado**: 2-5 minutos

---

## Paso 5: Configurar Base de Datos PostgreSQL

### 5.1. Agregar Base de Datos

1. En tu proyecto de Railway, haz clic en **"+ New"** (botón en la parte superior)

2. Selecciona **"Database"**

3. Selecciona **"PostgreSQL"**

4. Railway creará automáticamente una base de datos PostgreSQL

### 5.2. Obtener DATABASE_URL

1. Haz clic en la base de datos que acabas de crear

2. Ve a la pestaña **"Variables"**

3. Verás una variable llamada **`DATABASE_URL`**

4. **Copia este valor** (lo necesitarás después)

   Ejemplo: `postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway`

### 5.3. Conectar la Base de Datos al Servicio

1. Ve de vuelta a tu servicio (el que tiene `server.js`)

2. Haz clic en **"+ New"** → **"Variable"**

3. Agrega:
   - **Name**: `DATABASE_URL`
   - **Value**: Pega el valor que copiaste de la base de datos

4. Haz clic en **"Add"**

✅ **Railway automáticamente conectará la base de datos al servicio**

---

## Paso 6: Configurar Variables de Entorno (Opcional)

Si necesitas otras variables, puedes agregarlas:

1. En tu servicio, ve a la pestaña **"Variables"**

2. Haz clic en **"+ New Variable"**

3. Agrega las variables que necesites:
   - `NODE_ENV=production`
   - `ALLOWED_ORIGINS=https://tu-dominio.com` (opcional)

---

## Paso 7: Obtener la URL de tu API

### 7.1. Obtener el Dominio

1. En tu servicio (el que tiene `server.js`), ve a la pestaña **"Settings"**

2. Busca la sección **"Networking"**

3. Haz clic en **"Generate Domain"**

4. Railway te dará un dominio como: `moodtrack-api-production.up.railway.app`

5. **Copia este dominio**

### 7.2. Construir la URL de la API

Tu URL base será:
```
https://moodtrack-api-production.up.railway.app
```

Y tu API estará en:
```
https://moodtrack-api-production.up.railway.app/api
```

**Nota**: Railway asigna dominios aleatorios. Puedes configurar un dominio personalizado después si lo deseas.

---

## Paso 8: Actualizar la App Flutter

### 8.1. Buscar todas las URLs

Necesitas reemplazar `http://192.168.100.4:3000/api` en estos archivos:

1. `lib/lib/servicios/Guardar_Estado_Animo.dart`
2. `lib/lib/servicios/db_helper.dart`
3. `lib/lib/servicios/Autenticacion.dart`
4. `lib/lib/Pantallas/Pantalla_Tabla_Usuarios.dart`
5. `lib/lib/Pantallas/Pantalla_Principal.dart`
6. `lib/lib/Pantallas/Pantalla_registro.dart`
7. `lib/lib/Pantallas/Pantalla_registro_psicologo.dart`

### 8.2. Reemplazar las URLs

**Buscar:**
```dart
static const String baseUrl = 'http://192.168.100.4:3000/api';
```

**Reemplazar por:**
```dart
static const String baseUrl = 'https://TU_DOMINIO_RAILWAY.up.railway.app/api';
```

**Ejemplo:**
```dart
static const String baseUrl = 'https://moodtrack-api-production.up.railway.app/api';
```

### 8.3. Verificar que sea HTTPS

⚠️ **IMPORTANTE**: Asegúrate de usar `https://` no `http://`

Railway proporciona HTTPS automáticamente, pero debes usar la URL correcta.

---

## Paso 9: Probar la Conexión

### 9.1. Verificar que el Servidor Esté Corriendo

1. En Railway, ve a tu servicio
2. Ve a la pestaña **"Deployments"**
3. Deberías ver un despliegue exitoso (verde) ✅

### 9.2. Probar la API Directamente

Abre tu navegador y ve a:
```
https://TU_DOMINIO_RAILWAY.up.railway.app/
```

Deberías ver:
```json
{
  "mensaje": "¡Servidor funcionando!",
  "fecha": "..."
}
```

### 9.3. Probar desde la App Flutter

1. Ejecuta tu app Flutter
2. Intenta hacer login
3. Si funciona, ¡está todo listo! 🎉

---

## Solución de Problemas

### ❌ Error: "Cannot connect"

**Causa**: La URL no es correcta o el servidor no está corriendo

**Solución**:
1. Verifica la URL en Railway (Settings → Networking)
2. Asegúrate de usar `https://` no `http://`
3. Verifica que el despliegue esté activo (verde)

### ❌ Error: "Database connection failed"

**Causa**: `DATABASE_URL` no está configurada correctamente

**Solución**:
1. Ve a tu base de datos en Railway
2. Copia el `DATABASE_URL` completo
3. Ve a tu servicio → Variables
4. Verifica que `DATABASE_URL` esté configurada
5. Reinicia el servicio (Settings → Restart)

### ❌ Error: "CORS"

**Causa**: El servidor está bloqueando las peticiones

**Solución**:
El código ya está configurado para permitir todos los orígenes. Si persiste:
1. Verifica que `cors()` esté en `server.js`
2. Reinicia el servicio

### ❌ El despliegue falla

**Causa**: Error en el código o dependencias

**Solución**:
1. Ve a la pestaña **"Deployments"**
2. Haz clic en el despliegue fallido
3. Revisa los logs para ver el error
4. Corrige el error y haz push a GitHub
5. Railway desplegará automáticamente

### ❌ No puedo hacer push a GitHub

**Causa**: Problemas de autenticación

**Solución**:
1. Usa un Personal Access Token en lugar de contraseña
2. Ve a: https://github.com/settings/tokens
3. Genera un nuevo token con scope `repo`
4. Úsalo como contraseña cuando Git lo pida

---

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real

1. En Railway, ve a tu servicio
2. Haz clic en la pestaña **"Deployments"**
3. Haz clic en el despliegue activo
4. Verás los logs en tiempo real

### Métricas

Railway muestra:
- Uso de CPU
- Uso de memoria
- Tráfico de red
- Uso de base de datos

---

## 💰 Planes y Límites

### Plan Gratuito (Hobby)

- ✅ $5 de crédito gratis al mes
- ✅ 500 horas de uso
- ✅ Base de datos PostgreSQL incluida
- ✅ HTTPS automático
- ✅ Despliegue ilimitado

**Para proyectos pequeños, el plan gratuito es suficiente.**

### Si Necesitas Más

- Plan Developer: $20/mes
- Plan Team: $20/mes por usuario

---

## 🔄 Actualizaciones Automáticas

Railway despliega automáticamente cuando:
- Haces push a la rama `main` en GitHub
- Cambias variables de entorno
- Reinicias el servicio manualmente

**No necesitas hacer nada manual** - Railway lo hace automáticamente.

---

## 📝 Resumen de Pasos

1. ✅ Crear cuenta en Railway
2. ✅ Subir código a GitHub
3. ✅ Conectar repositorio en Railway
4. ✅ Agregar base de datos PostgreSQL
5. ✅ Configurar `DATABASE_URL`
6. ✅ Obtener dominio de Railway
7. ✅ Actualizar URLs en Flutter
8. ✅ Probar conexión

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu aplicación estará accesible desde **cualquier dispositivo en cualquier red** usando la URL de Railway.

**Ejemplo de URL final:**
```
https://moodtrack-api-production.up.railway.app/api
```

Esta URL funcionará desde:
- ✅ Tu teléfono en cualquier WiFi
- ✅ Dispositivos de otros usuarios
- ✅ Cualquier lugar con internet

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas en algún paso, revisa:
1. Los logs en Railway
2. La consola de tu app Flutter
3. La documentación de Railway: https://docs.railway.app/

¡Buena suerte con tu despliegue! 🚀
