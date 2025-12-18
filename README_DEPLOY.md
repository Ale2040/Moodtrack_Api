# 🚀 Guía Rápida: Hacer la App Accesible desde Cualquier Red

## Opción 1: Railway (Recomendado - Gratis) ⭐

### Pasos:

1. **Crear cuenta en Railway**
   - Ve a https://railway.app/
   - Crea cuenta con GitHub

2. **Crear nuevo proyecto**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio

3. **Agregar base de datos PostgreSQL**
   - En tu proyecto Railway → "New" → "Database" → "PostgreSQL"
   - Railway crea automáticamente la variable `DATABASE_URL`

4. **Obtener la URL**
   - Railway te dará una URL como: `https://tu-app.railway.app`
   - Tu API estará en: `https://tu-app.railway.app/api`

5. **Actualizar la app Flutter**
   - Busca todos los archivos con `http://192.168.100.4:3000/api`
   - Reemplázalos por: `https://tu-app.railway.app/api`

---

## Opción 2: Render (Gratis)

1. Ve a https://render.com/
2. "New" → "Web Service"
3. Conecta tu repositorio
4. Configura:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Agrega PostgreSQL desde "New" → "PostgreSQL"
6. Obtendrás: `https://tu-app.onrender.com/api`

---

## Opción 3: ngrok (Solo para pruebas)

```bash
# Instalar ngrok
npm install -g ngrok

# Iniciar tu servidor local
node server.js

# En otra terminal
ngrok http 3000
```

Obtendrás una URL temporal como: `https://abc123.ngrok.io/api`

⚠️ La URL cambia cada vez que reinicias ngrok

---

## 📱 Actualizar la App Flutter

### Buscar y reemplazar en todos los archivos:

**Buscar:**
```
http://192.168.100.4:3000/api
```

**Reemplazar por:**
```
https://tu-app.railway.app/api
```

### Archivos a actualizar:
- `lib/lib/servicios/Guardar_Estado_Animo.dart`
- `lib/lib/servicios/db_helper.dart`
- `lib/lib/servicios/Autenticacion.dart`
- `lib/lib/Pantallas/Pantalla_Tabla_Usuarios.dart`
- `lib/lib/Pantallas/Pantalla_Principal.dart`
- `lib/lib/Pantallas/Pantalla_registro.dart`
- `lib/lib/Pantallas/Pantalla_registro_psicologo.dart`

---

## ✅ Ventajas de usar servicios en la nube:

- ✅ Accesible desde cualquier lugar
- ✅ HTTPS incluido (seguro)
- ✅ No necesitas configurar router
- ✅ No necesitas IP pública
- ✅ Escalable
- ✅ Planes gratuitos disponibles

---

## 🔧 Configuración del servidor

El `server.js` ya está actualizado para:
- ✅ Usar variables de entorno
- ✅ Funcionar en producción
- ✅ Conectar a base de datos en la nube
- ✅ Escuchar en todas las interfaces (0.0.0.0)

---

## 🆘 ¿Problemas?

**Error de conexión:**
- Verifica que el servidor esté desplegado
- Revisa los logs en Railway/Render
- Verifica la URL en la app

**Error de base de datos:**
- Verifica que `DATABASE_URL` esté configurada
- Asegúrate de que la base de datos esté corriendo

**Error CORS:**
- El servidor ya está configurado para permitir todos los orígenes
- En producción, puedes restringir con `ALLOWED_ORIGINS`
