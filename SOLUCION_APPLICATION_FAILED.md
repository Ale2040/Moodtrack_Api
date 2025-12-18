# 🔧 Solución: "Application failed to respond"

## ❌ Error Actual

Railway muestra: **"Application failed to respond"**

Esto significa que tu servidor **no está iniciando correctamente** o se está **cayendo al iniciar**.

---

## 🔍 Paso 1: Revisar Logs de Deployment

1. **En Railway, ve a tu servicio "Moodtrack_Api"**
2. **Haz clic en "Deploy logs"** (el enlace que aparece en el error)
3. **O ve a la pestaña "Deployments"**
4. **Haz clic en el último deployment**
5. **Revisa los logs completos**

### Errores Comunes que Buscar:

#### ❌ Error 1: "Cannot find module 'xxx'"
**Causa:** Faltan dependencias en `package.json`

**Solución:**
```powershell
cd C:\Users\Alejandro\AndroidStudioProjects\MoodTrack_API
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

#### ❌ Error 2: "Error: listen EADDRINUSE"
**Causa:** Puerto ya en uso

**Solución:** Ya está resuelto en tu código (usa `process.env.PORT`)

#### ❌ Error 3: "Connection refused" o error de base de datos
**Causa:** `DATABASE_URL` no está configurada o es incorrecta

**Solución:**
1. Ve a Railway → Variables
2. Verifica que `DATABASE_URL` esté configurada
3. Debe ser algo como: `postgresql://postgres:password@host:5432/railway`

#### ❌ Error 4: "SyntaxError" o errores de JavaScript
**Causa:** Error de sintaxis en `server.js`

**Solución:** Revisa el error específico en los logs y corrígelo

#### ❌ Error 5: El servidor inicia pero luego se cae
**Causa:** Error en tiempo de ejecución

**Solución:** Revisa los logs para ver el error específico

---

## ✅ Paso 2: Verificar Archivos de Configuración

### Verificar `package.json`:

Asegúrate de que tenga:

```json
{
  "name": "moodtrack-api",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.x.x",
    "cors": "^2.x.x",
    "pg": "^8.x.x",
    "dotenv": "^16.x.x"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

### Verificar `Procfile`:

Debe contener:
```
web: node server.js
```

### Verificar `nixpacks.toml` (si existe):

Debe tener:
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run build || true"]

[start]
cmd = "node server.js"
```

---

## ✅ Paso 3: Verificar que el Servidor Inicie Correctamente

En los logs, deberías ver:

```
═══════════════════════════════════
🚀 Servidor iniciado
📍 Puerto: 3000 (o el que asigne Railway)
🌐 Modo: producción
☁️  Base de datos: Nube (DATABASE_URL)
═══════════════════════════════════
```

**Si NO ves esto:**
- El servidor no está iniciando
- Revisa los errores anteriores en los logs

---

## 🔧 Soluciones Rápidas

### Solución 1: Reinstalar Dependencias

```powershell
cd C:\Users\Alejandro\AndroidStudioProjects\MoodTrack_API
npm install
git add package.json package-lock.json
git commit -m "Reinstall dependencies"
git push
```

### Solución 2: Verificar Variables de Entorno

En Railway → Variables, verifica:
- ✅ `DATABASE_URL` está configurada
- ❌ `ALLOWED_ORIGINS` NO debe estar (o debe ser `*`)
- ✅ `NODE_ENV` puede estar como `production` (opcional)

### Solución 3: Verificar que `server.js` Esté en la Raíz

Asegúrate de que `server.js` esté en la raíz del proyecto, no en una subcarpeta.

### Solución 4: Forzar Rebuild

En Railway:
1. Ve a tu servicio
2. Pestaña "Settings"
3. Busca "Rebuild" o "Redeploy"
4. Haz clic para forzar un nuevo deployment

---

## 📋 Checklist

- [ ] Logs de deployment revisados
- [ ] Error específico identificado
- [ ] `package.json` tiene todas las dependencias
- [ ] `Procfile` existe y es correcto
- [ ] `DATABASE_URL` está configurada en Railway
- [ ] `server.js` está en la raíz del proyecto
- [ ] Código subido a Git y desplegado

---

## 🚀 Próximos Pasos

1. **Revisa los logs de deployment en Railway**
2. **Identifica el error específico**
3. **Comparte el error** que veas en los logs
4. **Te ayudo a solucionarlo**

---

## 💡 Tip

Los logs de Railway muestran **todo** el proceso de build y ejecución. Busca líneas que digan:
- ❌ "Error:"
- ❌ "Failed:"
- ❌ "Cannot"
- ❌ "Missing"

Estas líneas te dirán exactamente qué está fallando.

---

¡Revisa los logs y comparte el error específico que veas! 🔍
