# 🔍 Diagnosticar Error "Failed to fetch"

## ❌ Error Actual

```
Error de conexión: ClientException: Failed to fetch
uri=https://moodtrackapi-production.up.railway.app/api/login
```

Este error significa que tu app Flutter **no puede conectarse** al servidor en Railway.

---

## ✅ Pasos para Diagnosticar

### 1. Verificar que el Servidor Esté Online

1. **Abre tu navegador**
2. **Ve a:** `https://moodtrackapi-production.up.railway.app/`
3. **Deberías ver:**
   ```json
   {
     "mensaje": "¡Servidor funcionando!",
     "fecha": "..."
   }
   ```

**Si NO ves esto:**
- El servidor no está funcionando
- Ve al paso 2

**Si SÍ ves esto:**
- El servidor está funcionando
- El problema puede ser con la ruta `/api/login`
- Ve al paso 3

---

### 2. Verificar Logs en Railway

1. **En Railway, ve a tu servicio "Moodtrack_Api"**
2. **Pestaña "Deployments"**
3. **Haz clic en el último deployment**
4. **Revisa los logs:**
   - ¿Hay errores?
   - ¿Dice "Servidor escuchando en puerto XXXX"?
   - ¿Hay errores de conexión a la base de datos?

**Errores comunes:**
- ❌ "Cannot find module 'xxx'" → Faltan dependencias
- ❌ "Connection refused" → Problema con la base de datos
- ❌ "Port already in use" → Conflicto de puerto
- ❌ "EADDRINUSE" → Puerto ocupado

---

### 3. Verificar que el Servidor Esté Escuchando Correctamente

El servidor debe estar escuchando en `0.0.0.0` (no `localhost`):

```javascript
app.listen(puerto, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${puerto}`);
});
```

---

### 4. Verificar Variables de Entorno en Railway

En Railway, pestaña **"Variables"**, verifica:

✅ **`DATABASE_URL`** - Debe estar configurada  
✅ **`PORT`** - Railway la asigna automáticamente (no necesitas configurarla)  
❌ **`ALLOWED_ORIGINS`** - NO debe estar (o debe ser `*`)

---

### 5. Probar la Ruta de Login Directamente

1. **Abre Postman o tu navegador**
2. **Prueba hacer un POST a:**
   ```
   https://moodtrackapi-production.up.railway.app/api/login
   ```
3. **Body (JSON):**
   ```json
   {
     "usuario": "test",
     "password": "test"
   }
   ```

**Si funciona:**
- El servidor está bien
- El problema puede ser con la app Flutter

**Si NO funciona:**
- Hay un problema con el servidor
- Revisa los logs de Railway

---

### 6. Verificar HTTPS

Railway usa HTTPS automáticamente. Asegúrate de que:
- ✅ Tu app Flutter use `https://` (no `http://`)
- ✅ La URL no tenga el puerto (Railway lo maneja automáticamente)

---

## 🔧 Soluciones Comunes

### Solución 1: El Servidor No Está Desplegado

1. **Verifica en Railway:**
   - ¿El servicio está "Online"?
   - ¿Hay un deployment reciente?

2. **Si no hay deployment:**
   ```powershell
   cd C:\Users\Alejandro\AndroidStudioProjects\MoodTrack_API
   git add .
   git commit -m "Deploy to Railway"
   git push
   ```

### Solución 2: Error en el Código del Servidor

1. **Revisa los logs en Railway**
2. **Busca errores de sintaxis o módulos faltantes**
3. **Corrige los errores y vuelve a desplegar**

### Solución 3: Problema con la Base de Datos

1. **Verifica que `DATABASE_URL` esté correcta en Railway**
2. **Verifica que las tablas estén creadas**
3. **Prueba conectarte desde DBeaver**

### Solución 4: El Servidor No Está Escuchando en 0.0.0.0

Asegúrate de que en `server.js` tengas:

```javascript
app.listen(puerto, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${puerto}`);
});
```

---

## 📋 Checklist de Diagnóstico

- [ ] Servidor responde en `https://moodtrackapi-production.up.railway.app/`
- [ ] Logs de Railway no muestran errores
- [ ] `DATABASE_URL` está configurada en Railway
- [ ] El servidor está escuchando en `0.0.0.0`
- [ ] La ruta `/api/login` funciona en Postman/navegador
- [ ] La app Flutter usa `https://` (no `http://`)

---

## 🚀 Próximos Pasos

1. **Prueba acceder a la URL en el navegador**
2. **Revisa los logs en Railway**
3. **Comparte los errores que veas** para ayudarte mejor

---

¡Dime qué encuentras! 🔍
