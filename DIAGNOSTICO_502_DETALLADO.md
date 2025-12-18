# 🔍 Diagnóstico Detallado del Error 502

## 📊 Situación Actual

- ✅ Deployment: **"Deployment successful"**
- ✅ Servicio: **"Online"** (punto verde)
- ✅ Último commit: **"Ajuste de CORS"**
- ❌ HTTP Logs: **Todos muestran 502 Bad Gateway**

Esto indica que el servidor **inicia correctamente** pero **se cae o no responde** cuando recibe peticiones.

---

## 🔍 Pasos para Diagnosticar

### Paso 1: Revisar Deploy Logs Completos

1. **En Railway, ve a "Deploy Logs"**
2. **Desplázate HACIA ABAJO** para ver TODOS los logs
3. **Busca líneas DESPUÉS de "Servidor iniciado"**
4. **Busca específicamente:**
   - ❌ "Error:"
   - ❌ "Unhandled"
   - ❌ "Cannot"
   - ❌ "Failed"
   - ❌ "crash"
   - ❌ "killed"

**¿Qué buscar?**
- Si ves errores después de "Servidor iniciado" → El servidor se está cayendo
- Si NO ves errores → El servidor puede estar funcionando pero hay otro problema

---

### Paso 2: Revisar HTTP Logs en Tiempo Real

1. **En Railway, ve a "HTTP Logs"**
2. **Intenta hacer una petición** desde tu app Flutter o navegador
3. **Observa los logs en tiempo real:**
   - ¿Aparece la petición?
   - ¿Qué código de estado muestra?
   - ¿Hay algún mensaje de error?

---

### Paso 3: Verificar Variables de Entorno

1. **En Railway, ve a "Variables"**
2. **Verifica:**
   - ✅ `DATABASE_URL` está configurada
   - ❌ `ALLOWED_ORIGINS` NO debe estar (o debe ser `*`)
   - ❌ `PORT` NO debe estar (Railway la asigna automáticamente)

---

### Paso 4: Probar la Ruta Raíz

1. **Abre tu navegador**
2. **Ve a:** `https://moodtrackapi-production.up.railway.app/`
3. **¿Qué ves?**
   - Si ves el JSON con "mensaje": "¡Servidor funcionando!" → El servidor está funcionando
   - Si ves "Application failed to respond" → El servidor se está cayendo

---

## 🔧 Posibles Causas y Soluciones

### Causa 1: El Servidor Se Cae al Recibir Peticiones

**Síntoma:** El servidor inicia pero crashea cuando recibe peticiones.

**Solución:** Ya agregamos manejo de errores global. Verifica los logs para ver el error específico.

---

### Causa 2: Error en una Ruta Específica

**Síntoma:** Algunas rutas funcionan, otras no.

**Solución:** Revisa los logs de HTTP para ver qué ruta está fallando.

---

### Causa 3: Problema con la Base de Datos

**Síntoma:** El servidor inicia pero crashea al intentar usar la base de datos.

**Solución:** 
1. Verifica que `DATABASE_URL` esté correcta
2. Verifica que las tablas existan en la base de datos
3. Revisa los logs para ver errores de conexión

---

### Causa 4: El Servidor No Está Escuchando Correctamente

**Síntoma:** El servidor inicia pero Railway no puede conectarse.

**Solución:** Ya está configurado para escuchar en `0.0.0.0`. Verifica los logs para confirmar el puerto.

---

## 🚀 Acciones Inmediatas

### 1. Subir los Cambios de Manejo de Errores

Si aún no lo has hecho:

```powershell
cd C:\Users\Alejandro\AndroidStudioProjects\MoodTrack_API
git add server.js
git commit -m "Add global error handling to prevent crashes"
git push
```

### 2. Forzar un Nuevo Deployment

En Railway:
1. Ve a tu servicio
2. Pestaña "Settings"
3. Busca "Redeploy" o "Rebuild"
4. Haz clic para forzar un nuevo deployment

### 3. Revisar Logs Después del Nuevo Deployment

1. Espera a que termine el deployment
2. Revisa "Deploy Logs" completos
3. Intenta hacer una petición
4. Revisa "HTTP Logs" para ver si el 502 persiste

---

## 📋 Checklist de Diagnóstico

- [ ] Deploy Logs completos revisados (desplazarse hacia abajo)
- [ ] Errores después de "Servidor iniciado" identificados
- [ ] HTTP Logs revisados en tiempo real
- [ ] Variables de entorno verificadas
- [ ] Ruta raíz probada en navegador
- [ ] Cambios de manejo de errores subidos a Git
- [ ] Nuevo deployment forzado

---

## 💡 Próximos Pasos

1. **Revisa los Deploy Logs COMPLETOS** (muy importante - desplázate hacia abajo)
2. **Comparte los errores** que encuentres después de "Servidor iniciado"
3. **Sube los cambios** de manejo de errores si aún no lo has hecho
4. **Fuerza un nuevo deployment** y prueba nuevamente

---

¡Los logs te dirán exactamente qué está fallando! 🔍
