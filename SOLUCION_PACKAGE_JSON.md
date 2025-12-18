# 🔧 Solución: Error "path /app/package.json" no encontrado

## ❌ El Problema

El error muestra:
```
npm ERR! path /app/package.json
npm ERR! syscall open
```

Esto significa que Railway **no encuentra** el archivo `package.json` durante el build.

## 🔍 Posibles Causas

1. **El `package.json` no está en la raíz del repositorio de GitHub**
2. **El código está en una subcarpeta** y Railway no lo detecta
3. **El archivo no se subió correctamente** a GitHub

## ✅ Solución

### Paso 1: Verificar que package.json esté en la raíz

Abre tu repositorio en GitHub y verifica que `package.json` esté en la raíz, no en una subcarpeta.

La estructura debería ser:
```
MoodTrack_API/
├── package.json  ← DEBE estar aquí
├── server.js
├── nixpacks.toml
├── railway.json
└── ...
```

**NO debería ser:**
```
MoodTrack_API/
└── alguna-carpeta/
    ├── package.json  ← ❌ NO aquí
    └── server.js
```

### Paso 2: Verificar en GitHub

1. Ve a tu repositorio en GitHub: `https://github.com/Ale2040/MoodTrack`
2. Verifica que `package.json` esté visible en la lista de archivos de la raíz
3. Si NO está visible, significa que no se subió correctamente

### Paso 3: Asegurarse de que los archivos estén en Git

Si los archivos no están en GitHub, necesitas agregarlos:

```powershell
cd C:\Users\Alejandro\AndroidStudioProjects\MoodTrack_API

# Verificar qué archivos están en Git
git ls-files

# Si package.json NO aparece, agregarlo:
git add package.json server.js nixpacks.toml railway.json .gitignore Procfile

# Hacer commit
git commit -m "Add all necessary files for Railway deployment"

# Subir a GitHub
git push
```

### Paso 4: Verificar la Estructura del Repositorio

Si tu repositorio tiene una estructura diferente (por ejemplo, el código está en una subcarpeta), necesitas:

**Opción A: Mover los archivos a la raíz**

Si tu código está en `MoodTrack_API/api/` o similar, muévelo a la raíz.

**Opción B: Configurar Railway para usar una subcarpeta**

1. En Railway, ve a tu servicio
2. Settings → Build
3. Agrega en "Root Directory": la carpeta donde está tu código
   - Ejemplo: si está en `api/`, escribe `api`

### Paso 5: Verificar que Railway Esté Usando el Repositorio Correcto

1. En Railway, ve a tu proyecto
2. Verifica que esté conectado al repositorio correcto
3. Verifica que esté usando la rama `main` o `master`

---

## 🚀 Pasos Rápidos para Corregir

### Si package.json NO está en GitHub:

```powershell
cd C:\Users\Alejandro\AndroidStudioProjects\MoodTrack_API

# Agregar todos los archivos necesarios
git add package.json server.js package-lock.json nixpacks.toml railway.json .gitignore Procfile

# Verificar que se agregaron
git status

# Hacer commit
git commit -m "Add all files for Railway deployment"

# Subir a GitHub
git push
```

### Si package.json SÍ está en GitHub pero Railway no lo encuentra:

1. En Railway, ve a Settings → Build
2. Verifica que "Root Directory" esté **vacío** (no tenga ninguna ruta)
3. Guarda los cambios
4. Railway desplegará de nuevo

---

## 📋 Checklist

- [ ] `package.json` está en la raíz del repositorio de GitHub
- [ ] `server.js` está en la raíz del repositorio de GitHub
- [ ] Los archivos están en Git (`git ls-files` los muestra)
- [ ] Los archivos están en GitHub (visibles en la web)
- [ ] Railway está conectado al repositorio correcto
- [ ] "Root Directory" en Railway está vacío
- [ ] Se hizo push de todos los archivos

---

## 🔍 Verificar en GitHub

1. Ve a: `https://github.com/Ale2040/MoodTrack`
2. Verifica que veas estos archivos en la raíz:
   - ✅ `package.json`
   - ✅ `server.js`
   - ✅ `nixpacks.toml`
   - ✅ `railway.json`

Si NO los ves, necesitas hacer push de ellos.

---

## 💡 Si el Problema Persiste

Si después de verificar todo el error continúa:

1. **Elimina el servicio en Railway**
2. **Crea un nuevo servicio**
3. **Conecta el mismo repositorio**
4. Railway intentará detectar automáticamente

O también puedes:

1. En Railway → Settings → Build
2. Cambia el "Builder" a "Dockerfile"
3. Crea un `Dockerfile` simple (te puedo ayudar con esto)

---

## 📞 Comparte

¿Puedes verificar en GitHub si `package.json` está visible en la raíz del repositorio?

Si no está, necesitamos hacer push de los archivos.
