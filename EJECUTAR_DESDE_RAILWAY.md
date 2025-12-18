# 🚀 Ejecutar Script SQL desde Railway - Guía Paso a Paso

## 📸 Basado en tu Pantalla Actual

Veo que tu base de datos está vacía ("You have no tables"). Aquí te muestro cómo ejecutar el script SQL.

---

## ✅ Método 1: Usar DBeaver (Más Fácil) ⭐⭐⭐

### Paso 1: Obtener Credenciales de Railway

1. **Haz clic en el botón "Connect"** (esquina superior derecha en Railway)
2. **Copia la información de conexión** que aparece
3. Necesitarás:
   - **Host**
   - **Port** (generalmente 5432)
   - **Database** (generalmente "railway")
   - **User** (generalmente "postgres")
   - **Password**

### Paso 2: Instalar DBeaver

1. Ve a: https://dbeaver.io/download/
2. Descarga la versión Community (gratis)
3. Instálalo

### Paso 3: Conectar a Railway

1. **Abre DBeaver**
2. **Clic en "New Database Connection"** (icono de enchufe 🔌)
3. **Selecciona "PostgreSQL"**
4. **Configuración:**
   - **Host**: El host que copiaste de Railway
   - **Port**: `5432` (o el que te dio Railway)
   - **Database**: `railway` (o el que te dio Railway)
   - **Username**: `postgres` (o el que te dio Railway)
   - **Password**: La contraseña que copiaste
5. **Haz clic en "Test Connection"**
   - Si te pide descargar drivers, acepta
6. **Si funciona, haz clic en "Finish"**

### Paso 4: Ejecutar el Script

1. **En DBeaver, expande tu conexión** → **"Databases"** → **"railway"**
2. **Clic derecho en "railway"** → **"SQL Editor"** → **"New SQL Script"**
3. **Abre el archivo `crear_tablas_simple.sql`** en tu computadora
4. **Copia TODO el contenido** (Ctrl+A, Ctrl+C)
5. **Pega en el editor SQL de DBeaver** (Ctrl+V)
6. **Haz clic en "Execute SQL Script"** (botón ▶️) o presiona **Ctrl+Enter**

✅ **¡Listo!** Las tablas se crearán automáticamente.

---

## ✅ Método 2: Usar pgAdmin

### Paso 1: Instalar pgAdmin

1. Ve a: https://www.pgadmin.org/download/
2. Descarga e instala pgAdmin 4

### Paso 2: Conectar

1. **Abre pgAdmin**
2. **Clic derecho en "Servers"** → **"Register"** → **"Server"**
3. **Pestaña "General":**
   - **Name**: `Railway MoodTrack`
4. **Pestaña "Connection":**
   - **Host name/address**: El host de Railway (del botón "Connect")
   - **Port**: `5432`
   - **Maintenance database**: `railway`
   - **Username**: `postgres`
   - **Password**: La contraseña de Railway
5. **Haz clic en "Save"**

### Paso 3: Ejecutar Script

1. **Expande "Servers"** → **"Railway MoodTrack"** → **"Databases"** → **"railway"**
2. **Clic derecho en "railway"** → **"Query Tool"**
3. **Abre `crear_tablas_simple.sql`** en tu computadora
4. **Copia y pega todo el contenido**
5. **Haz clic en "Execute"** (⚡) o presiona **F5**

---

## ✅ Método 3: Usar psql (Línea de Comandos)

Si tienes PostgreSQL instalado localmente:

### Paso 1: Obtener DATABASE_URL

Desde Railway, en el botón "Connect", copia la **DATABASE_URL** completa.

### Paso 2: Ejecutar

```powershell
# En PowerShell, ejecuta:
psql "postgresql://postgres:PASSWORD@HOST:5432/railway" -f crear_tablas_simple.sql
```

Reemplaza:
- `PASSWORD`: Tu contraseña
- `HOST`: El host de Railway

---

## 📝 Archivo a Ejecutar

El archivo que debes ejecutar es: **`crear_tablas_simple.sql`**

Este script crea:
- ✅ Tabla `usuarios`
- ✅ Tabla `estados`
- ✅ Tabla `psicologos`
- ✅ Tabla `usuarios_por_psicologo`
- ✅ Tabla `metas`
- ✅ Tabla `recordatorios`
- ✅ Índices para rendimiento

---

## 🔍 Verificar que Funcionó

Después de ejecutar, en DBeaver o pgAdmin, ejecuta:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver las 6 tablas listadas.

---

## 🚀 Recomendación

**Usa DBeaver** - Es la opción más fácil y visual. Te permite ver las tablas creadas inmediatamente.

---

## ⚠️ Nota

El botón "Create table" en Railway abre un formulario para crear una tabla manualmente. Para ejecutar tu script SQL completo, necesitas un cliente externo como DBeaver o pgAdmin.

---

¡Listo! 🎉
