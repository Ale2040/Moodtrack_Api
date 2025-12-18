# 🔧 Configurar DATABASE_URL en Railway

## ✅ DATABASE_URL que tienes:

```
postgresql://postgres:IFVKqgmrRJRyTbfSvtmmhCxvQzGwpaSL@postgres.railway.internal:5432/railway
```

Esta es la URL **interna** de Railway (nota el `postgres.railway.internal`).

## 📋 Pasos para Configurarla

### Paso 1: Agregar DATABASE_URL al Servicio

1. **En Railway, haz clic en tu servicio** (el que tiene `server.js`)

2. **Ve a la pestaña "Variables"**

3. **Haz clic en "+ New Variable"**

4. **Agrega:**
   - **Name**: `DATABASE_URL`
   - **Value**: 
     ```
     postgresql://postgres:IFVKqgmrRJRyTbfSvtmmhCxvQzGwpaSL@postgres.railway.internal:5432/railway
     ```

5. **Haz clic en "Add"**

### Paso 2: Verificar que se Agregó

1. En la lista de variables, deberías ver `DATABASE_URL`
2. Railway reiniciará automáticamente tu servicio

### Paso 3: Verificar la Conexión

1. Ve a **Deployments** → Haz clic en el despliegue activo
2. En los logs, busca: **"Conexión a PostgreSQL exitosa"** ✅

---

## ⚠️ Nota Importante

Esta URL usa `postgres.railway.internal` que es para conexiones **dentro de Railway**.

Si tu servicio y base de datos están en el mismo proyecto de Railway, esta URL funcionará perfectamente.

---

## 🆘 Si la Conexión Falla

Si ves errores de conexión, Railway también proporciona una URL externa. Para obtenerla:

1. Ve a tu base de datos
2. Pestaña **"Settings"**
3. Busca **"Connection"** o **"Public Network"**
4. Ahí verás una URL externa (sin `.internal`)
5. Úsala en lugar de la interna si es necesario

---

## ✅ Después de Configurar

Una vez que agregues `DATABASE_URL`:

1. Railway reiniciará el servicio automáticamente
2. El servidor se conectará a la base de datos
3. Verás en los logs: "Conexión a PostgreSQL exitosa"

¡Listo! 🎉
