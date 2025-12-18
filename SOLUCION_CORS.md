# 🔧 Solución de Error CORS en Railway

## ✅ Problema Resuelto

He actualizado la configuración de CORS en `server.js` para que funcione correctamente con tu app Flutter.

## 🔍 Cambios Realizados

### Antes:
- El código no manejaba correctamente las peticiones sin `Origin` (común en apps móviles)
- Podía fallar si `ALLOWED_ORIGINS` estaba mal configurado

### Ahora:
- ✅ Permite peticiones sin `Origin` (apps móviles, Postman)
- ✅ Permite todos los orígenes si `ALLOWED_ORIGINS` contiene `*` o no está definido
- ✅ Métodos HTTP permitidos explícitamente
- ✅ Headers permitidos configurados

## 📝 Configuración en Railway

### Opción 1: Permitir Todos (Recomendado para desarrollo)

En Railway, en la pestaña **"Variables"** de tu servicio:

**NO agregues** la variable `ALLOWED_ORIGINS` (o déjala vacía)

Esto permitirá todas las conexiones.

### Opción 2: Orígenes Específicos (Producción)

Si quieres restringir los orígenes, agrega en Railway:

**Variable:** `ALLOWED_ORIGINS`  
**Valor:** `https://tu-dominio.com,https://otro-dominio.com`

## 🚀 Desplegar los Cambios

1. **Haz commit de los cambios:**
   ```powershell
   cd C:\Users\Alejandro\AndroidStudioProjects\MoodTrack_API
   git add server.js
   git commit -m "Fix CORS configuration for mobile apps"
   git push
   ```

2. **Railway desplegará automáticamente** los cambios

3. **Espera unos minutos** a que el deploy termine

4. **Prueba tu app Flutter** nuevamente

## ✅ Verificar que Funciona

Después del deploy, prueba:

1. **Abre tu app Flutter**
2. **Intenta hacer login**
3. **Si funciona, ¡está solucionado!** 🎉

## 🔍 Si Aún Hay Problemas

### Verificar Logs en Railway:

1. Ve a tu servicio en Railway
2. Pestaña **"Deployments"**
3. Haz clic en el último deployment
4. Revisa los logs para ver errores de CORS

### Verificar Variables de Entorno:

1. Pestaña **"Variables"** en Railway
2. Verifica que `ALLOWED_ORIGINS` no esté configurada (o esté vacía)
3. Si está configurada, elimínala o cámbiala a `*`

## 📋 Checklist

- [ ] Cambios en `server.js` guardados
- [ ] Cambios subidos a Git
- [ ] Railway desplegó los cambios
- [ ] App Flutter probada
- [ ] CORS funcionando ✅

---

¡Listo! 🎉
