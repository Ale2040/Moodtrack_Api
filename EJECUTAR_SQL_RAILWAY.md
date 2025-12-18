# 🗄️ Cómo Ejecutar Scripts SQL en Railway

## 📋 Opciones para Ejecutar tu DDL

Tienes 3 opciones para crear las tablas en Railway:

---

## ✅ Opción 1: Desde Railway (Más Fácil)

### Paso 1: Abrir el Editor SQL

1. **En Railway, haz clic en tu base de datos PostgreSQL**
2. **Ve a la pestaña "Data"** o **"Query"**
3. Railway tiene un editor SQL integrado

### Paso 2: Ejecutar el Script

1. **Abre el archivo `crear_tablas_completo.sql`** en tu computadora
2. **Copia TODO el contenido** del archivo
3. **Pega el contenido en el editor SQL de Railway**
4. **Haz clic en "Run"** o **"Execute"**

✅ **Listo!** Las tablas se crearán automáticamente.

---

## ✅ Opción 2: Usar pgAdmin (Recomendado para scripts grandes)

### Paso 1: Instalar pgAdmin

1. Descarga pgAdmin desde: https://www.pgadmin.org/download/
2. Instálalo en tu computadora

### Paso 2: Conectar a Railway

1. **Abre pgAdmin**
2. **Clic derecho en "Servers"** → **"Register"** → **"Server"**
3. En la pestaña **"General"**:
   - **Name**: MoodTrack Railway
4. En la pestaña **"Connection"**:
   - **Host**: `containers-us-west-xxx.railway.app` (de tu DATABASE_URL)
   - **Port**: `5432`
   - **Database**: `railway`
   - **Username**: `postgres`
   - **Password**: `IFVKqgmrRJRyTbfSvtmmhCxvQzGwpaSL` (de tu DATABASE_URL)
5. **Haz clic en "Save"**

### Paso 3: Ejecutar el Script

1. **Clic derecho en la base de datos "railway"**
2. **"Query Tool"**
3. **Abre el archivo `crear_tablas_completo.sql`**
4. **Haz clic en "Execute"** (⚡)

✅ **Listo!** Las tablas se crearán.

---

## ✅ Opción 3: Usar DBeaver (Gratis y Fácil)

### Paso 1: Instalar DBeaver

1. Descarga desde: https://dbeaver.io/download/
2. Instálalo

### Paso 2: Conectar a Railway

1. **Abre DBeaver**
2. **"New Database Connection"** → **"PostgreSQL"**
3. **Configuración:**
   - **Host**: Extrae de tu DATABASE_URL (ej: `containers-us-west-xxx.railway.app`)
   - **Port**: `5432`
   - **Database**: `railway`
   - **Username**: `postgres`
   - **Password**: `IFVKqgmrRJRyTbfSvtmmhCxvQzGwpaSL`
4. **"Test Connection"** → **"Finish"**

### Paso 3: Ejecutar el Script

1. **Clic derecho en la base de datos** → **"SQL Editor"** → **"New SQL Script"**
2. **Abre el archivo `crear_tablas_completo.sql`**
3. **Haz clic en "Execute SQL Script"** (▶️)

✅ **Listo!**

---

## ✅ Opción 4: Usar psql (Línea de Comandos)

Si tienes PostgreSQL instalado localmente:

```powershell
# Conectar usando DATABASE_URL
$env:PGPASSWORD="IFVKqgmrRJRyTbfSvtmmhCxvQzGwpaSL"
psql -h containers-us-west-xxx.railway.app -U postgres -d railway -f crear_tablas_completo.sql
```

---

## 📝 Script que Debes Ejecutar

He creado el archivo **`crear_tablas_completo.sql`** que incluye:

✅ Creación de todas las tablas:
- `usuarios`
- `estados`
- `psicologos`
- `usuarios_por_psicologo`
- `metas`
- `recordatorios`

✅ Foreign Keys (relaciones)
✅ Índices para rendimiento
✅ Triggers para validación

---

## 🔍 Verificar que se Crearon

Después de ejecutar el script, verifica:

```sql
-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Deberías ver:
-- usuarios
-- estados
-- psicologos
-- usuarios_por_psicologo
-- metas
-- recordatorios
```

---

## ⚠️ Nota Importante

El script usa `CREATE TABLE IF NOT EXISTS`, así que puedes ejecutarlo múltiples veces sin problemas.

Si las tablas ya existen, el script solo agregará las foreign keys y triggers que falten.

---

## 🚀 Recomendación

**Usa la Opción 1 (Railway)** si es simple y rápida.

**Usa pgAdmin o DBeaver** si prefieres una interfaz gráfica más completa.

---

## ✅ Después de Ejecutar

1. Verifica que las tablas se crearon
2. Tu servidor en Railway debería poder conectarse
3. Los logs deberían mostrar: "Conexión a PostgreSQL exitosa"

¡Listo! 🎉
