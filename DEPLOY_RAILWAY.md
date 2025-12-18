# Guía para Desplegar en Railway (Gratis)

## 🚀 Opción 1: Railway (Recomendado - Gratis)

### Paso 1: Crear cuenta en Railway
1. Ve a https://railway.app/
2. Crea una cuenta (puedes usar GitHub)
3. Haz clic en "New Project"

### Paso 2: Conectar tu repositorio
1. Selecciona "Deploy from GitHub repo"
2. Conecta tu repositorio o crea uno nuevo
3. Railway detectará automáticamente que es Node.js

### Paso 3: Configurar variables de entorno
En Railway, ve a tu proyecto → Variables y agrega:
```
DATABASE_URL=postgresql://usuario:password@host:5432/database
PORT=3000
```

### Paso 4: Configurar el puerto
Railway asigna un puerto dinámico. Actualiza `server.js`:

```javascript
const puerto = process.env.PORT || 3000;

app.listen(puerto, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${puerto}`);
});
```

### Paso 5: Obtener la URL
Railway te dará una URL como: `https://tu-app.railway.app`
Úsala en tu app Flutter: `https://tu-app.railway.app/api`

---

## 🌐 Opción 2: Render (Gratis)

### Paso 1: Crear cuenta
1. Ve a https://render.com/
2. Crea una cuenta gratuita

### Paso 2: Nuevo Web Service
1. Click en "New" → "Web Service"
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Name**: moodtrack-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

### Paso 3: Variables de entorno
Agrega en "Environment":
```
DATABASE_URL=tu_connection_string
```

### Paso 4: Obtener URL
Render te dará: `https://moodtrack-api.onrender.com`
Úsala en tu app: `https://moodtrack-api.onrender.com/api`

---

## 🔧 Opción 3: ngrok (Para desarrollo/pruebas)

### Instalación
```bash
npm install -g ngrok
# O descarga desde https://ngrok.com/
```

### Uso
1. Inicia tu servidor local:
   ```bash
   node server.js
   ```

2. En otra terminal, ejecuta:
   ```bash
   ngrok http 3000
   ```

3. Obtendrás una URL como: `https://abc123.ngrok.io`
4. Úsala en tu app: `https://abc123.ngrok.io/api`

⚠️ **Nota**: La URL de ngrok cambia cada vez que lo reinicias (a menos que tengas cuenta paga)

---

## 📱 Actualizar la App Flutter

Después de desplegar, actualiza la URL en tu app:

### Opción A: Cambiar en cada archivo
Busca y reemplaza `http://192.168.100.4:3000/api` por tu nueva URL.

### Opción B: Usar Config.dart (si lo tienes)
Edita `lib/lib/servicios/Config.dart`:
```dart
static const String baseUrl = 'https://tu-app.railway.app/api';
// O
static const String baseUrl = 'https://moodtrack-api.onrender.com/api';
```

---

## 🔒 Configurar HTTPS

Los servicios en la nube (Railway, Render) ya incluyen HTTPS automáticamente.

Si usas IP pública, necesitarás:
- Certificado SSL (Let's Encrypt es gratis)
- O usar Cloudflare como proxy

---

## ⚙️ Configurar Base de Datos en la Nube

### Opción 1: Railway PostgreSQL
Railway ofrece PostgreSQL gratuito:
1. En tu proyecto Railway → "New" → "Database" → "PostgreSQL"
2. Railway crea automáticamente la variable `DATABASE_URL`
3. Actualiza tu código para usar esta variable

### Opción 2: Render PostgreSQL
1. En Render → "New" → "PostgreSQL"
2. Copia la "Internal Database URL"
3. Úsala como `DATABASE_URL`

### Opción 3: Servicios externos
- **Supabase** (gratis): https://supabase.com/
- **ElephantSQL** (gratis): https://www.elephantsql.com/
- **Neon** (gratis): https://neon.tech/

---

## 🛠️ Actualizar server.js para producción

```javascript
// Al inicio del archivo
const puerto = process.env.PORT || 3000;

// Configurar CORS para producción
const allowedOrigins = [
  'https://tu-dominio.com',
  'http://localhost:3000', // Solo para desarrollo
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

// Al final del archivo
app.listen(puerto, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${puerto}`);
});
```

---

## 📝 Checklist de Despliegue

- [ ] Servidor desplegado en la nube
- [ ] Base de datos configurada
- [ ] Variables de entorno configuradas
- [ ] URL actualizada en la app Flutter
- [ ] CORS configurado correctamente
- [ ] HTTPS habilitado
- [ ] Probar conexión desde la app

---

## 🆘 Troubleshooting

**Error: Cannot connect**
- Verifica que el servidor esté corriendo
- Verifica la URL en la app
- Revisa los logs del servidor

**Error: CORS**
- Configura CORS para permitir tu dominio
- O permite todos los orígenes en desarrollo

**Error: Database connection**
- Verifica `DATABASE_URL`
- Asegúrate de que la base de datos esté accesible desde internet
