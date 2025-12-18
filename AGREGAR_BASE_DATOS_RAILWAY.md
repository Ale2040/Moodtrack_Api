# 🗄️ Cómo Agregar Base de Datos PostgreSQL en Railway

## 📋 Pasos Detallados

### Paso 1: Agregar Base de Datos PostgreSQL

1. **En Railway, ve a tu proyecto**
   - Deberías ver tu servicio (el que tiene `server.js`)

2. **Haz clic en "+ New"** (botón en la parte superior del proyecto)

3. **Selecciona "Database"**

4. **Selecciona "PostgreSQL"**
   - Railway comenzará a crear la base de datos automáticamente
   - Esto tomará 1-2 minutos

### Paso 2: Obtener DATABASE_URL

Una vez que la base de datos esté creada:

1. **Haz clic en la base de datos** que acabas de crear
   - Verás las pestañas: "Data", "Variables", "Metrics", "Settings"

2. **Ve a la pestaña "Variables"**

3. **Busca la variable `DATABASE_URL`**
   - Railway la crea automáticamente
   - Se verá algo como:
     ```
     postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
     ```

4. **Copia este valor completo**

### Paso 3: Conectar la Base de Datos al Servicio

Ahora necesitas conectar la base de datos a tu servicio de API:

#### Opción A: Conexión Automática (Recomendado)

Railway puede conectar automáticamente la base de datos:

1. **Haz clic en tu servicio** (el que tiene `server.js`)

2. **Ve a la pestaña "Variables"**

3. **Haz clic en "+ New Variable"**

4. **Agrega:**
   - **Name**: `DATABASE_URL`
   - **Value**: Pega el valor que copiaste de la base de datos

5. **Haz clic en "Add"**

#### Opción B: Usar la Variable de Referencia

Railway también permite referenciar variables de otros servicios:

1. En tu servicio → Variables → "+ New Variable"
2. **Name**: `DATABASE_URL`
3. En lugar de pegar el valor, puedes hacer clic en el icono de referencia
4. Selecciona la base de datos y la variable `DATABASE_URL`
5. Railway la conectará automáticamente

### Paso 4: Verificar la Conexión

1. **Reinicia tu servicio** (si es necesario):
   - Settings → Restart

2. **Ve a los logs**:
   - Deployments → Haz clic en el despliegue activo
   - Deberías ver: "Conexión a PostgreSQL exitosa" ✅

### Paso 5: Crear las Tablas en la Base de Datos

Tu base de datos está vacía. Necesitas crear las tablas:

#### Opción A: Desde Railway (Recomendado)

1. **Haz clic en tu base de datos**
2. **Ve a la pestaña "Data"**
3. **Haz clic en "Query"** o "Connect"
4. **Copia y pega el contenido de `crear_foreign_keys.sql`**
5. **Ejecuta las consultas**

#### Opción B: Desde tu Computadora

1. **Obtén la conexión de Railway**:
   - Base de datos → Variables → `DATABASE_URL`

2. **Usa un cliente PostgreSQL**:
   - **pgAdmin** (gratis): https://www.pgadmin.org/
   - **DBeaver** (gratis): https://dbeaver.io/
   - **psql** (línea de comandos)

3. **Conecta usando `DATABASE_URL`**

4. **Ejecuta el script `crear_foreign_keys.sql`**

---

## 🔧 Configuración Adicional

### Variables de Entorno Recomendadas

En tu servicio, puedes agregar estas variables (opcionales):

- `NODE_ENV=production`
- `PORT=3000` (Railway lo asigna automáticamente, pero puedes especificarlo)

---

## ✅ Checklist

- [ ] Base de datos PostgreSQL creada en Railway
- [ ] `DATABASE_URL` copiada de la base de datos
- [ ] `DATABASE_URL` agregada como variable en el servicio
- [ ] Servicio reiniciado (si es necesario)
- [ ] Conexión verificada en los logs
- [ ] Tablas creadas en la base de datos

---

## 🆘 Problemas Comunes

### Error: "Database connection failed"

**Solución**:
1. Verifica que `DATABASE_URL` esté en las variables del servicio
2. Verifica que el valor sea correcto (copiado completo)
3. Reinicia el servicio

### Error: "relation does not exist"

**Solución**:
- Las tablas no están creadas
- Ejecuta el script SQL para crear las tablas

### No veo la pestaña "Variables"

**Solución**:
- Asegúrate de hacer clic en el servicio/base de datos correcto
- Las variables están en la pestaña "Variables"

---

## 📝 Resumen Rápido

1. Railway → "+ New" → "Database" → "PostgreSQL"
2. Base de datos → "Variables" → Copiar `DATABASE_URL`
3. Servicio → "Variables" → Agregar `DATABASE_URL`
4. Reiniciar servicio
5. Crear tablas con el script SQL

¡Listo! Tu base de datos estará conectada. 🎉
