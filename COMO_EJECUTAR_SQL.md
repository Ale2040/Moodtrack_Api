# 🗄️ Cómo Ejecutar Scripts SQL en Railway

## 📋 3 Formas de Ejecutar tu DDL

---

## ✅ Opción 1: Desde Railway (Más Fácil) ⭐

### Paso 1: Abrir el Editor SQL en Railway

1. **En Railway, haz clic en tu base de datos PostgreSQL**
2. **Ve a la pestaña "Data"** o busca un botón **"Query"** o **"Connect"**
3. Railway tiene un editor SQL integrado

### Paso 2: Ejecutar el Script

1. **Abre el archivo `crear_tablas_simple.sql`** en tu computadora
2. **Copia TODO el contenido** del archivo (Ctrl+A, Ctrl+C)
3. **Pega el contenido en el editor SQL de Railway**
4. **Haz clic en "Run"** o **"Execute"** o presiona F5

✅ **Listo!** Las tablas se crearán automáticamente.

---

## ✅ Opción 2: Usar DBeaver (Recomendado) ⭐⭐

### Paso 1: Instalar DBeaver

1. Descarga desde: https://dbeaver.io/download/
2. Instálalo (es gratis)

### Paso 2: Conectar a Railway

1. **Abre DBeaver**
2. **Clic en "New Database Connection"** (icono de enchufe)
3. **Selecciona "PostgreSQL"**
4. **Configuración:**
   - **Host**: Extrae de tu DATABASE_URL
     - De: `postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway`
     - Host es: `containers-us-west-xxx.railway.app`
   - **Port**: `5432`
   - **Database**: `railway`
   - **Username**: `postgres`
   - **Password**: `IFVKqgmrRJRyTbfSvtmmhCxvQzGwpaSL`
5. **"Test Connection"** → Si funciona, **"Finish"**

### Paso 3: Ejecutar el Script

1. **Clic derecho en la base de datos "railway"**
2. **"SQL Editor"** → **"New SQL Script"**
3. **Abre el archivo `crear_tablas_simple.sql`**
4. **Copia y pega el contenido**
5. **Haz clic en "Execute SQL Script"** (▶️) o presiona Ctrl+Enter

✅ **Listo!**

---

## ✅ Opción 3: Usar pgAdmin

### Paso 1: Instalar pgAdmin

1. Descarga desde: https://www.pgadmin.org/download/
2. Instálalo

### Paso 2: Conectar

1. **Clic derecho en "Servers"** → **"Register"** → **"Server"**
2. **General** → Name: `Railway MoodTrack`
3. **Connection**:
   - Host: `containers-us-west-xxx.railway.app`
   - Port: `5432`
   - Database: `railway`
   - Username: `postgres`
   - Password: `IFVKqgmrRJRyTbfSvtmmhCxvQzGwpaSL`
4. **Save**

### Paso 3: Ejecutar

1. **Clic derecho en "railway"** → **"Query Tool"**
2. **Abre `crear_tablas_simple.sql`**
3. **Haz clic en "Execute"** (⚡)

---

## 📝 Script que Debes Ejecutar

He creado **`crear_tablas_simple.sql`** que incluye:

✅ **Tablas:**
- `usuarios`
- `estados`
- `psicologos`
- `usuarios_por_psicologo`
- `metas`
- `recordatorios`

✅ **Foreign Keys** (relaciones)
✅ **Índices** (para rendimiento)

---

## 🔍 Verificar que se Crearon

Después de ejecutar, verifica:

```sql
-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Deberías ver:
-- estados
-- metas
-- psicologos
-- recordatorios
-- usuarios
-- usuarios_por_psicologo
```

---

## ⚠️ Nota sobre Foreign Keys

La tabla `usuarios_por_psicologo` tiene columnas **VARCHAR** (no INTEGER), por lo que las foreign keys directas no funcionan.

El script crea las tablas sin foreign keys para esa tabla, pero los **triggers** validan la integridad.

Si necesitas foreign keys estrictas, tendrías que cambiar las columnas a INTEGER, pero eso requeriría cambios en el código del servidor.

---

## ✅ Después de Ejecutar

1. ✅ Verifica que las tablas se crearon
2. ✅ Tu servidor en Railway debería poder conectarse
3. ✅ Los logs deberían mostrar: "Conexión a PostgreSQL exitosa"

---

## 🚀 Recomendación

**Usa DBeaver** - Es la opción más fácil y visual para ejecutar scripts SQL.

¡Listo! 🎉
