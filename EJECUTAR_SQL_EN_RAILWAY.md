# 📝 Ejecutar Scripts SQL en Railway

## ⚠️ Importante: Railway NO tiene Editor SQL Integrado

Railway **no tiene un editor SQL** directamente en su interfaz web. Tienes que usar un cliente externo como **DBeaver**.

---

## ✅ Opción 1: Usar DBeaver (Recomendado) ⭐⭐⭐

### Paso 1: Obtener Credenciales de Railway

1. **En Railway, haz clic en tu base de datos PostgreSQL**
2. **Haz clic en el botón "Connect"** (esquina superior derecha)
3. **Copia la información de conexión:**
   - **Host** (ej: `containers-us-west-xxx.railway.app`)
   - **Port** (generalmente `5432`)
   - **Database** (generalmente `railway`)
   - **User** (generalmente `postgres`)
   - **Password** (cópiala)

### Paso 2: Conectar desde DBeaver

1. **Abre DBeaver**
2. **Clic en "New Database Connection"** (icono de enchufe 🔌)
3. **Selecciona "PostgreSQL"**
4. **Configuración:**
   - **Host**: El host que copiaste de Railway
   - **Port**: `5432`
   - **Database**: `railway` (o el que te dio Railway)
   - **Username**: `postgres`
   - **Password**: La contraseña que copiaste
5. **Haz clic en "Test Connection"**
   - Si te pide descargar drivers, acepta
6. **Si funciona, haz clic en "Finish"**

### Paso 3: Abrir Editor SQL en DBeaver

1. **En DBeaver, expande tu conexión a Railway**
2. **Clic derecho en la base de datos "railway"**
3. **"SQL Editor"** → **"New SQL Script"**
4. **Se abrirá un editor SQL** donde puedes pegar tus scripts

### Paso 4: Ejecutar tu Script DDL

1. **Abre el archivo `crear_tablas_simple.sql`** en tu computadora
2. **Copia TODO el contenido** (Ctrl+A, Ctrl+C)
3. **Pega en el editor SQL de DBeaver** (Ctrl+V)
4. **Haz clic en "Execute SQL Script"** (botón ▶️) o presiona **Ctrl+Enter**

✅ **¡Listo!** Las tablas se crearán automáticamente.

---

## ✅ Opción 2: Usar psql (Línea de Comandos)

Si tienes PostgreSQL instalado localmente:

### Paso 1: Obtener DATABASE_URL

En Railway, en el botón "Connect", copia la **DATABASE_URL** completa:
```
postgresql://postgres:PASSWORD@HOST:5432/railway
```

### Paso 2: Ejecutar Script

```powershell
# En PowerShell, ejecuta:
psql "postgresql://postgres:PASSWORD@HOST:5432/railway" -f crear_tablas_simple.sql
```

Reemplaza:
- `PASSWORD`: Tu contraseña de Railway
- `HOST`: El host de Railway (ej: `containers-us-west-xxx.railway.app`)

---

## ✅ Opción 3: Usar pgAdmin

1. **Instala pgAdmin**: https://www.pgadmin.org/download/
2. **Conecta a Railway:**
   - Clic derecho en "Servers" → "Register" → "Server"
   - **General**: Name: `Railway`
   - **Connection**: Usa las credenciales del botón "Connect" de Railway
3. **Abre Query Tool:**
   - Clic derecho en la base de datos → "Query Tool"
4. **Pega tu script SQL** y ejecuta (F5)

---

## 📝 Resumen Rápido

**Railway NO tiene editor SQL → Usa DBeaver:**

1. **"Connect" en Railway** → Copia credenciales
2. **DBeaver** → Nueva conexión PostgreSQL
3. **Clic derecho en base de datos** → "SQL Editor" → "New SQL Script"
4. **Pega tu script** → Ejecuta (Ctrl+Enter)

---

## 🔍 Verificar que Funcionó

Después de ejecutar, en DBeaver ejecuta:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver tus tablas creadas.

---

## 🚀 Recomendación

**Usa DBeaver** - Es la forma más fácil y visual. Una vez conectado, puedes ejecutar cualquier script SQL fácilmente.

---

¡Listo! 🎉
