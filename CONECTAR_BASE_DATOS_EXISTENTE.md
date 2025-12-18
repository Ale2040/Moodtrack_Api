# 🔌 Conectar Base de Datos Existente con DBeaver

## 📋 Conectar tu Base de Datos Local

Si ya tienes una base de datos PostgreSQL local con tus tablas y datos, puedes conectarla fácilmente con DBeaver.

---

## ✅ Paso 1: Instalar DBeaver

1. **Descarga DBeaver**: https://dbeaver.io/download/
2. **Instálalo** (versión Community es gratis)

---

## ✅ Paso 2: Conectar a tu Base de Datos Local

### Configuración para PostgreSQL Local

1. **Abre DBeaver**
2. **Clic en "New Database Connection"** (icono de enchufe 🔌)
3. **Selecciona "PostgreSQL"**
4. **Configuración:**
   - **Host**: `localhost` o `127.0.0.1`
   - **Port**: `5432` (puerto por defecto de PostgreSQL)
   - **Database**: El nombre de tu base de datos (ej: `postgres`, `moodtrack`, etc.)
   - **Username**: `postgres` (o el usuario que uses)
   - **Password**: Tu contraseña de PostgreSQL
5. **Haz clic en "Test Connection"**
   - Si te pide descargar drivers, acepta
6. **Si funciona, haz clic en "Finish"**

✅ **¡Listo!** Ya puedes ver tu base de datos local.

---

## ✅ Paso 3: Ver tus Tablas Existentes

1. **Expande tu conexión** en el panel izquierdo
2. **"Databases"** → **Tu base de datos** → **"Schemas"** → **"public"** → **"Tables"**
3. **Deberías ver todas tus tablas:**
   - `usuarios`
   - `estados`
   - `psicologos`
   - `usuarios_por_psicologo`
   - `metas`
   - `recordatorios`

---

## 🔄 Migrar Datos de Local a Railway

Si quieres copiar tus datos de la base local a Railway:

### Opción 1: Exportar/Importar con DBeaver

#### Exportar desde Local:

1. **Clic derecho en tu base de datos local** → **"Tools"** → **"Export Data"**
2. **Selecciona las tablas** que quieres exportar
3. **Formato**: SQL (INSERT statements) o CSV
4. **Guarda el archivo**

#### Importar a Railway:

1. **Conecta a Railway** (ver instrucciones abajo)
2. **Clic derecho en la base de datos de Railway** → **"Tools"** → **"Import Data"**
3. **Selecciona el archivo** que exportaste
4. **Sigue el asistente**

---

### Opción 2: Usar pg_dump (Recomendado)

#### Exportar desde Local:

```powershell
# En PowerShell, ejecuta:
pg_dump -h localhost -U postgres -d NOMBRE_DE_TU_BASE -F c -f backup.dump
```

Reemplaza `NOMBRE_DE_TU_BASE` con el nombre de tu base de datos.

#### Importar a Railway:

1. **Obtén las credenciales de Railway** (botón "Connect")
2. **Ejecuta:**

```powershell
pg_restore -h HOST_RAILWAY -U postgres -d railway -F c backup.dump
```

Reemplaza `HOST_RAILWAY` con el host de Railway.

---

## 🔌 Conectar a Railway desde DBeaver

### Paso 1: Obtener Credenciales de Railway

1. **En Railway, haz clic en tu base de datos PostgreSQL**
2. **Haz clic en "Connect"** (esquina superior derecha)
3. **Copia la información de conexión**

### Paso 2: Crear Nueva Conexión en DBeaver

1. **"New Database Connection"** → **"PostgreSQL"**
2. **Configuración:**
   - **Host**: El host de Railway (ej: `containers-us-west-xxx.railway.app`)
   - **Port**: `5432`
   - **Database**: `railway` (o el que te indique Railway)
   - **Username**: `postgres`
   - **Password**: La contraseña de Railway
3. **"Test Connection"** → **"Finish"**

✅ **¡Listo!** Ya tienes ambas conexiones en DBeaver.

---

## 📊 Comparar y Migrar Datos

### Ver Datos en Ambas Bases:

1. **Expande tu conexión local** → **"Tables"** → **Clic derecho en una tabla** → **"View Data"**
2. **Haz lo mismo con Railway** para comparar

### Copiar Datos Específicos:

1. **En tu base local:**
   - **Clic derecho en una tabla** → **"Export Data"**
   - **Formato**: SQL (INSERT)
   - **Guarda el archivo**

2. **En Railway:**
   - **Clic derecho en la base de datos** → **"SQL Editor"** → **"New SQL Script"**
   - **Abre el archivo SQL exportado**
   - **Ejecuta** (Ctrl+Enter)

---

## 🔍 Verificar Estructura de Tablas

### Ver Estructura de una Tabla:

1. **Clic derecho en una tabla** → **"Properties"**
2. **Pestaña "Columns"**: Ver columnas y tipos
3. **Pestaña "Constraints"**: Ver foreign keys, primary keys, etc.

### Comparar Estructuras:

1. **Abre dos editores SQL** (uno para cada conexión)
2. **Ejecuta en ambos:**

```sql
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

---

## ⚠️ Notas Importantes

1. **Backup antes de migrar**: Siempre haz un backup de tu base local antes de modificar algo.

2. **Foreign Keys**: Si tienes foreign keys, asegúrate de importar las tablas en el orden correcto (primero las tablas referenciadas, luego las que referencian).

3. **Tipos de Datos**: Verifica que los tipos de datos coincidan entre local y Railway.

4. **Datos Sensibles**: Si tienes datos de producción, ten cuidado al migrar.

---

## 🚀 Recomendación

1. **Conecta ambas bases** en DBeaver (local y Railway)
2. **Compara las estructuras** de las tablas
3. **Exporta datos de local** si necesitas migrarlos
4. **Importa a Railway** cuando estés listo

---

## ✅ Checklist

- [ ] DBeaver instalado
- [ ] Conexión a base de datos local creada
- [ ] Conexión a Railway creada
- [ ] Tablas visibles en ambas conexiones
- [ ] Backup de base local realizado (si vas a migrar)
- [ ] Datos migrados (si es necesario)

---

¡Listo! 🎉
