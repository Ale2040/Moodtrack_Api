# 🔧 Solución: Error 502 Bad Gateway

## ❌ Problema

Todos los logs HTTP muestran **502 Bad Gateway**. Esto significa que:
- Railway (el proxy) **no puede comunicarse** con tu servidor
- Aunque el servidor inició, **se está cayendo** o **no está respondiendo**

---

## 🔍 Causas Comunes del Error 502

### 1. El Servidor Se Está Cayendo Después de Iniciar

**Síntoma:** Los logs de deployment muestran que inició, pero luego no responde.

**Causa:** Error en tiempo de ejecución que crashea el servidor.

**Solución:** Revisa los logs de deployment **completos** para ver si hay errores después de "Servidor iniciado".

---

### 2. El Servidor No Está Escuchando en el Puerto Correcto

**Síntoma:** El servidor inicia pero Railway no puede conectarse.

**Causa:** El servidor no está usando `process.env.PORT` correctamente.

**Solución:** Verifica que `server.js` use:
```javascript
const puerto = process.env.PORT || 3000;
app.listen(puerto, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${puerto}`);
});
```

---

### 3. El Servidor Se Cae al Recibir Peticiones

**Síntoma:** El servidor inicia bien, pero crashea cuando recibe peticiones.

**Causa:** Error en el manejo de peticiones (middleware, rutas, etc.).

**Solución:** Agrega manejo de errores global.

---

### 4. Problema con la Base de Datos

**Síntoma:** El servidor inicia pero crashea al intentar usar la base de datos.

**Causa:** `DATABASE_URL` incorrecta o base de datos no accesible.

**Solución:** Verifica `DATABASE_URL` en Railway → Variables.

---

## ✅ Soluciones

### Solución 1: Agregar Manejo de Errores Global

Agrega esto **ANTES** de `app.listen()` en `server.js`:

```javascript
// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    mensaje: process.env.NODE_ENV === 'production' 
      ? 'Error en el servidor' 
      : err.message
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path
  });
});
```

### Solución 2: Verificar que el Servidor Esté Escuchando Correctamente

Asegúrate de que `server.js` tenga:

```javascript
const puerto = process.env.PORT || 3000;

app.listen(puerto, '0.0.0.0', () => {
  console.log('═══════════════════════════════════');
  console.log('🚀 Servidor iniciado');
  console.log(`📍 Puerto: ${puerto}`);
  console.log(`🌐 Modo: ${process.env.NODE_ENV || 'desarrollo'}`);
  if (process.env.DATABASE_URL) {
    console.log('☁️  Base de datos: Nube (DATABASE_URL)');
  } else {
    console.log('💻 Base de datos: Local');
  }
  console.log('═══════════════════════════════════');
});
```

### Solución 3: Agregar Try-Catch en Rutas Críticas

Envuelve las rutas en try-catch para evitar que crasheen el servidor:

```javascript
app.post('/api/login', async (req, res) => {
  try {
    // ... tu código ...
  } catch (error) {
    console.error('Error en /api/login:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      detalle: error.message
    });
  }
});
```

### Solución 4: Verificar Variables de Entorno

En Railway → Variables:
- ✅ `DATABASE_URL` debe estar configurada
- ✅ `PORT` NO debe estar (Railway la asigna automáticamente)
- ❌ `ALLOWED_ORIGINS` NO debe estar (o debe ser `*`)

---

## 🔍 Pasos para Diagnosticar

### Paso 1: Revisar Logs de Deployment Completos

1. **En Railway, ve a "Deploy Logs"**
2. **Desplázate hacia abajo** para ver TODOS los logs
3. **Busca errores** después de "Servidor iniciado"
4. **Busca líneas con:**
   - ❌ "Error:"
   - ❌ "Unhandled"
   - ❌ "Cannot"
   - ❌ "Failed"

### Paso 2: Verificar que el Servidor Esté Escuchando

En los logs, deberías ver:
```
📍 Puerto: 8080 (o el que asigne Railway)
```

Si NO ves esto, el servidor no está escuchando correctamente.

### Paso 3: Probar Conexión a la Base de Datos

En los logs, deberías ver:
```
Conexión a PostgreSQL exitosa: ...
```

Si NO ves esto, hay un problema con la base de datos.

---

## 🚀 Próximos Pasos

1. **Revisa los logs de deployment COMPLETOS** (desplázate hacia abajo)
2. **Busca errores** después de "Servidor iniciado"
3. **Comparte los errores** que encuentres
4. **Aplicaré las soluciones** necesarias

---

## 💡 Tip

El error 502 generalmente significa que el servidor **se está cayendo** cuando recibe peticiones. Los logs de deployment te dirán exactamente qué está fallando.

---

¡Revisa los logs completos y comparte los errores que veas! 🔍
