# 🔧 Solución: Deploy Fallido en Railway

## 📋 Pasos para Diagnosticar el Problema

### 1. Ver los Logs en Railway

1. Ve a tu proyecto en Railway
2. Haz clic en el servicio que falló
3. Ve a la pestaña **"Deployments"**
4. Haz clic en el despliegue que falló (debería estar en rojo)
5. **Copia el error completo** que aparece en los logs

### 2. Errores Comunes y Soluciones

---

## ❌ Error: "Cannot find module"

**Causa**: Faltan dependencias o `package.json` incorrecto

**Solución**:
1. Verifica que `package.json` tenga todas las dependencias:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "pg": "^8.11.3",
    "dotenv": "^16.3.1"
  }
}
```

2. Asegúrate de que `node_modules` NO esté en el repositorio (debe estar en `.gitignore`)

3. Haz commit y push:
```powershell
git add package.json
git commit -m "Fix package.json"
git push
```

---

## ❌ Error: "Port already in use" o "EADDRINUSE"

**Causa**: El código está usando un puerto fijo

**Solución**: Verifica que `server.js` use:
```javascript
const puerto = process.env.PORT || 3000;
```

Y que escuche en `0.0.0.0`:
```javascript
app.listen(puerto, '0.0.0.0', () => {
  // ...
});
```

---

## ❌ Error: "Database connection failed"

**Causa**: `DATABASE_URL` no está configurada o es incorrecta

**Solución**:
1. Ve a tu base de datos en Railway
2. Pestaña "Variables"
3. Copia el valor de `DATABASE_URL`
4. Ve a tu servicio → "Variables"
5. Agrega o actualiza `DATABASE_URL` con el valor copiado
6. Reinicia el servicio

---

## ❌ Error: "Missing script: start"

**Causa**: `package.json` no tiene el script `start`

**Solución**: Verifica que `package.json` tenga:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

---

## ❌ Error: "Module not found: dotenv"

**Causa**: Falta la dependencia `dotenv`

**Solución**:
1. En `package.json`, agrega:
```json
{
  "dependencies": {
    "dotenv": "^16.3.1"
  }
}
```

2. Haz commit y push

---

## ❌ Error: "SyntaxError" o errores de JavaScript

**Causa**: Error de sintaxis en el código

**Solución**:
1. Revisa los logs para ver la línea exacta del error
2. Corrige el error en tu código
3. Haz commit y push

---

## 🔍 Verificar que Todo Esté Correcto

### Checklist Pre-Deploy:

- [ ] `package.json` tiene `"start": "node server.js"`
- [ ] `package.json` tiene todas las dependencias
- [ ] `server.js` usa `process.env.PORT || 3000`
- [ ] `server.js` escucha en `0.0.0.0`
- [ ] `server.js` maneja `DATABASE_URL` correctamente
- [ ] `.gitignore` incluye `node_modules/`
- [ ] No hay errores de sintaxis en el código
- [ ] El código está en GitHub

---

## 🛠️ Pasos para Corregir

### 1. Verificar package.json

Abre `MoodTrack_API/package.json` y verifica que tenga:

```json
{
  "name": "moodtrack_api",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "pg": "^8.11.3",
    "dotenv": "^16.3.1"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

### 2. Verificar server.js

Abre `MoodTrack_API/server.js` y verifica:

```javascript
// ✅ Puerto dinámico
const puerto = process.env.PORT || 3000;

// ✅ Base de datos con DATABASE_URL
if (process.env.DATABASE_URL) {
  baseDatos = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

// ✅ Escuchar en 0.0.0.0
app.listen(puerto, '0.0.0.0', () => {
  // ...
});
```

### 3. Verificar .gitignore

Crea o verifica `MoodTrack_API/.gitignore`:

```
node_modules/
.env
.DS_Store
*.log
```

### 4. Hacer Commit y Push

```powershell
cd C:\Users\Alejandro\AndroidStudioProjects\MoodTrack_API
git add .
git commit -m "Fix deploy configuration"
git push
```

Railway desplegará automáticamente.

---

## 📸 ¿Qué Error Ves Exactamente?

Para ayudarte mejor, necesito saber:

1. **¿Qué dice el error en los logs de Railway?**
   - Copia el mensaje de error completo

2. **¿En qué paso falla?**
   - ¿Durante "Installing dependencies"?
   - ¿Durante "Building"?
   - ¿Durante "Starting"?

3. **¿El despliegue está en rojo o amarillo?**
   - Rojo = Error
   - Amarillo = En proceso

---

## 🚀 Solución Rápida (Si Todo Falla)

### Opción 1: Recrear el Proyecto

1. En Railway, elimina el proyecto actual
2. Crea un nuevo proyecto
3. Conecta el mismo repositorio
4. Railway intentará desplegar de nuevo

### Opción 2: Verificar Build Logs

1. Ve a tu servicio en Railway
2. Pestaña "Deployments"
3. Haz clic en el despliegue fallido
4. Revisa los logs completos
5. Busca la palabra "Error" o "Failed"
6. Copia el mensaje completo

---

## 💡 Tips

- Railway muestra los logs en tiempo real
- Los errores suelen estar al final de los logs
- Si ves "Build successful" pero falla después, el problema es en el código
- Si falla durante "Installing dependencies", revisa `package.json`

---

## 📞 Comparte el Error

Copia y pega aquí el error completo que ves en Railway para poder ayudarte mejor.
