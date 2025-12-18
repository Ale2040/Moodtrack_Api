# 🚂 Pasos Simples para Railway

## ⚡ Guía Rápida (5 minutos)

### 1️⃣ Crear Cuenta
- Ve a https://railway.app/
- Login con GitHub

### 2️⃣ Subir Código a GitHub
```powershell
cd C:\Users\Alejandro\AndroidStudioProjects\MoodTrack_API
git init
git add .
git commit -m "API para Railway"
# Crea repo en GitHub y luego:
git remote add origin https://github.com/TU_USUARIO/MoodTrack_API.git
git push -u origin main
```

### 3️⃣ Desplegar en Railway
- Railway → "New Project"
- "Deploy from GitHub repo"
- Selecciona tu repo
- ✅ Railway despliega automáticamente

### 4️⃣ Agregar Base de Datos
- En tu proyecto → "+ New" → "Database" → "PostgreSQL"
- Railway crea automáticamente `DATABASE_URL`

### 5️⃣ Obtener URL
- Servicio → Settings → Networking → "Generate Domain"
- Copia la URL: `https://tu-app.up.railway.app`

### 6️⃣ Actualizar Flutter
Busca y reemplaza en todos los archivos:
```
http://192.168.100.4:3000/api
```
Por:
```
https://tu-app.up.railway.app/api
```

### 7️⃣ Probar
- Abre la app
- Intenta hacer login
- ✅ ¡Funciona desde cualquier red!

---

## 📝 Archivos a Actualizar en Flutter

1. `lib/lib/servicios/Guardar_Estado_Animo.dart`
2. `lib/lib/servicios/db_helper.dart`
3. `lib/lib/servicios/Autenticacion.dart`
4. `lib/lib/Pantallas/Pantalla_Tabla_Usuarios.dart`
5. `lib/lib/Pantallas/Pantalla_Principal.dart`
6. `lib/lib/Pantallas/Pantalla_registro.dart`
7. `lib/lib/Pantallas/Pantalla_registro_psicologo.dart`

**Buscar:**
```dart
'http://192.168.100.4:3000/api'
```

**Reemplazar por:**
```dart
'https://TU_DOMINIO_RAILWAY.up.railway.app/api'
```

---

## ✅ Checklist

- [ ] Cuenta de Railway creada
- [ ] Código subido a GitHub
- [ ] Proyecto creado en Railway
- [ ] Base de datos PostgreSQL agregada
- [ ] URL obtenida de Railway
- [ ] URLs actualizadas en Flutter
- [ ] App probada y funcionando

---

## 🆘 Problemas Comunes

**No conecta:**
- Verifica que uses `https://` no `http://`
- Revisa los logs en Railway

**Error de base de datos:**
- Verifica que `DATABASE_URL` esté en Variables
- Reinicia el servicio

**Despliegue falla:**
- Revisa los logs en Railway
- Verifica que `package.json` tenga `"start": "node server.js"`
