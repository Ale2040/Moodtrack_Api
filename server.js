// server.js - Archivo principal del servidor
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

// Crear la aplicación Express
const app = express();
const puerto = process.env.PORT || 3000;

// Configuración de la base de datos PostgreSQL
const baseDatos = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Configurar middlewares
app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (apps móviles Flutter, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'https://moodtrack-prueba-cumr.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    // Verificar si el origen está en la lista permitida
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Permitir también si viene de una app móvil (no tiene origin estándar)
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.options('*', cors());
app.use(express.json());

// RUTA PRINCIPAL - Para probar que funciona
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '¡Servidor funcionando!', 
    fecha: new Date().toLocaleString() 
  });
});

// RUTA PARA REGISTRO DE USUARIOS
app.post('/api/register', async (req, res) => {
  console.log('═══════════════════════════════════');
  console.log('📨 Petición recibida en /api/register');
  console.log('📦 Body completo:', req.body);
  
  const { usuario, password } = req.body;
  
  console.log('Usuario extraído:', usuario);
  console.log('Password extraído:', password ? '***' : 'vacío');
  
  // Validar que los campos no estén vacíos
  if (!usuario || !password) {
    console.log('Faltan datos');
    return res.status(400).json({ 
      error: 'Usuario y contraseña son obligatorios' 
    });
  }

  // Validar longitud de contraseña
  if (password.length < 6) {
    console.log('Contraseña muy corta');
    return res.status(400).json({ 
      error: 'La contraseña debe tener al menos 6 caracteres' 
    });
  }
  
  try {
    console.log('Verificando si el usuario ya existe...');
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await baseDatos.query(`
      SELECT usuario 
      FROM usuarios 
      WHERE usuario = $1
    `, [usuario]);
    
    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Este usuario ya está registrado' 
      });
    }
    
    console.log('Insertando nuevo usuario en la base de datos...');
    
    // Insertar el nuevo usuario y obtener el ID generado
    const resultado = await baseDatos.query(`
      INSERT INTO usuarios (usuario, password,tipo_usuario) 
      VALUES ($1, $2,1) 
      RETURNING id, usuario, password
    `, [usuario, password]);
    
    const nuevoUsuario = resultado.rows[0];
    console.log('Usuario registrado exitosamente:', nuevoUsuario.usuario);
    console.log('ID del usuario:', nuevoUsuario.id);
    
    const respuesta = {
      success: true,
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        usuario: nuevoUsuario.usuario
      }
    };
    
    res.status(201).json(respuesta);
    
  } catch (error) {
    console.error('Error en registro:', error.message);
    console.log('═══════════════════════════════════');
    res.status(500).json({ 
      error: 'Error en el servidor',
      detalle: error.message 
    });
  }
});

app.post('/api/registrarPsicologo', async (req, res) => {
  console.log('═══════════════════════════════════');
  console.log('📨 Petición recibida en /api/register');
  console.log('📦 Body completo:', req.body);
  
  const { usuario, password,registro } = req.body;
  
  console.log('Usuario extraído:', usuario);
  console.log('Password extraído:', password ? '***' : 'vacío');
  
  // Validar que los campos no estén vacíos
  if (!usuario || !password || !registro ) {
    console.log('Faltan datos');
    return res.status(400).json({ 
      error: 'Usuario y contraseña son vobligatorios' 
    });
  }

  // Validar longitud de contraseña
  if (password.length < 6) {
    console.log('Contraseña muy corta');
    return res.status(400).json({ 
      error: 'La contraseña debe tener al menos 6 caracteres' 
    });
  }
  
  try {
    console.log('Verificando si el usuario ya existe...');
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await baseDatos.query(`
      SELECT usuario 
      FROM usuarios 
      WHERE usuario = $1
    `, [usuario]);

    const registroexiste = await baseDatos.query(`
      select p.nro_registro
      FROM psicologos p
      where p.nro_registro  = $1
    `, [registro]);
    
    if (usuarioExistente.rows.length > 0) {
      console.log('El usuario ya está registrado');
      return res.status(409).json({ 
        error: 'Este usuario ya está registrado' 
      });
    }

    if (registroexiste.rows.length = 0) {
      return res.status(409).json({ 
        error: 'No existe el nro de registro ingresado' 
      });
    }
    
    console.log('Insertando nuevo usuario en la base de datos...');
    
    // Insertar el nuevo usuario y obtener el ID generado
    const resultado = await baseDatos.query(`
      INSERT INTO usuarios (usuario, password,tipo_usuario) 
      VALUES ($1, $2,2) 
      RETURNING id, usuario, password
    `, [usuario, password]);
    
    const nuevoUsuario = resultado.rows[0];
    console.log('Usuario registrado exitosamente:', nuevoUsuario.usuario);
    console.log('ID del usuario:', nuevoUsuario.id);
    
    const respuesta = {
      success: true,
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        usuario: nuevoUsuario.usuario
      }
    };
    
    res.status(201).json(respuesta);
    
  } catch (error) {
    console.error('Error en registro:', error.message);
    console.log('═══════════════════════════════════');
    res.status(500).json({ 
      error: 'Error en el servidor',
      detalle: error.message 
    });
  }
});

// RUTA PARA LOGIN
app.post('/api/login', async (req, res) => {
  console.log('═══════════════════════════════════');
  console.log('📨 Petición recibida en /api/login');
  console.log('📦 Body completo:', req.body);
  
  const { usuario, password } = req.body;
  
  console.log('Usuario extraído:', usuario);
  console.log('Password extraído:', password ? '***' : 'vacío');
  
  if (!usuario || !password) {
    console.log('Faltan datos');
    return res.status(400).json({ 
      error: 'Usuario y contraseña son obligatorios' 
    });
  }
  
  try {
    console.log('Buscando en base de datos...');
    
    const resultado = await baseDatos.query(`
      SELECT id, usuario, password, tipo_usuario 
      FROM usuarios 
      WHERE usuario = $1 AND password = $2
    `, [usuario, password]);
    
    console.log('Registros encontrados:', resultado.rows.length);
    
    if (resultado.rows.length === 0) {
      console.log('Credenciales incorrectas');
      return res.status(401).json({ 
        error: 'Credenciales incorrectas' 
      });
    }
    
    const usuarioData = resultado.rows[0];
    console.log('Login exitoso:', usuarioData.usuario);
    console.log('Tipo de usuario:', usuarioData.tipo_usuario);
    
    const respuesta = {
      success: true,
      usuario: {
        id: usuarioData.id,
        usuario: usuarioData.usuario,
        tipo_usuario: parseInt(usuarioData.tipo_usuario) || 1
      }
    };
    
    console.log('Enviando respuesta:', JSON.stringify(respuesta));
    console.log('═══════════════════════════════════');
    
    res.json(respuesta);
    
  } catch (error) {
    console.error('Error en login:', error.message);
    console.log('═══════════════════════════════════');
    res.status(500).json({ 
      error: 'Error en el servidor',
      detalle: error.message 
    });
  }
});

// RUTA PARA INSERTAR PSICÓLOGO
app.post('/api/psicologos', async (req, res) => {
  console.log('═══════════════════════════════════');
  
  const { codigo, nombre, especialidad, nro_registro, usuario_sistema } = req.body;
  
  // Validar datos obligatorios
  if (!codigo || !nombre || !usuario_sistema) {
    console.log('Faltan datos obligatorios');
    return res.status(400).json({ 
      error: 'Código, nombre y usuario_sistema son obligatorios' 
    });
  }
  
  try {
    console.log('Verificando si el código ya existe...');
    
    // Verificar si el código ya existe
    const codigoExistente = await baseDatos.query(`
      SELECT codigo 
      FROM psicologos 
      WHERE codigo = $1
    `, [codigo]);
    
    if (codigoExistente.rows.length > 0) {
      console.log('El código ya está registrado');
      return res.status(409).json({ 
        error: 'Este código ya está registrado' 
      });
    }
    
    console.log('Insertando nuevo psicólogo...');
    
    // Insertar el nuevo psicólogo
    const resultado = await baseDatos.query(`
      INSERT INTO psicologos (codigo, nombre, especialidad, nro_registro, usuario_sistema) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `, [codigo, nombre, especialidad, nro_registro, usuario_sistema]);
    
    const nuevoPsicologo = resultado.rows[0];
    console.log('Psicólogo registrado exitosamente:', nuevoPsicologo.nombre);
    
    const respuesta = {
      success: true,
      mensaje: 'Psicólogo registrado exitosamente',
      psicologo: nuevoPsicologo
    };
    
    console.log('Enviando respuesta:', JSON.stringify(respuesta));
    console.log('═══════════════════════════════════');
    
    res.status(201).json(respuesta);
    
  } catch (error) {
    console.error('Error al registrar psicólogo:', error.message);
    console.log('═══════════════════════════════════');
    res.status(500).json({ 
      error: 'Error en el servidor',
      detalle: error.message 
    });
  }
});

app.post('/api/estados-animo', async (req, res) => {
  console.log('Body:', req.body);
  console.log('Body completo:', req.body);
  const { id_usuario, estado, comentario } = req.body;
  
  try {
    // Usar zona horaria UTC-3 (America/Argentina/Buenos_Aires, America/Santiago, etc.)
    // Esto asegura que se guarde en la hora local correcta
    const resultado = await baseDatos.query(`
      INSERT INTO estados (id_usuario, estado, comentario, fecha_creacion) 
      VALUES ($1, $2, $3, (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires')) 
      RETURNING id, id_usuario, estado, comentario, fecha_creacion
    `, [id_usuario, estado, comentario]);
    
    const estadoGuardado = resultado.rows[0];
    console.log('Estado de ánimo guardado:', estadoGuardado.id);
    console.log('Fecha y hora de creación guardada (desde DB):', estadoGuardado.fecha_creacion);
    
    res.status(201).json({
      success: true,
      data: estadoGuardado
    });
    
  } catch (error) {
    console.log('Fallo');
    console.error('Error al guardar estado de ánimo:', error); 
    res.status(500).json({ 
      error: 'Error al guardar',
      detalle: error.message 
    });
  }
});

// GET: Obtener todos los estados de ánimo (para psicólogos)
// IMPORTANTE: Esta ruta debe ir ANTES de /api/estados-animo/:usuarioid
// para que Express la coincida primero cuando se accede a /api/estados-animo/todos
app.get('/api/estados-animo/todos', async (req, res) => {
  const { fecha_inicio, psicologo_id } = req.query;
  
  console.log('Obteniendo todos los estados de ánimo');
  console.log('Psicólogo ID:', psicologo_id);
  console.log('Fecha inicio:', fecha_inicio);
  
  try {
    const fechaInicio = fecha_inicio || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    let query;
    let params;
    
    if (psicologo_id) {
      // Si es psicólogo, solo obtener estados de sus pacientes
      // Convertir psicologo_id a entero
      const psicologoIdInt = parseInt(psicologo_id);
      
      if (isNaN(psicologoIdInt)) {
        return res.status(400).json({ 
          error: 'psicologo_id debe ser un número válido' 
        });
      }
      
      query = `
        SELECT 
          e.id,
          e.estado,
          e.comentario,
          e.fecha_creacion,
          e.id_usuario,
          u.usuario as nombre_usuario
        FROM estados e
        INNER JOIN usuarios u ON e.id_usuario = u.id
        INNER JOIN usuarios_por_psicologo upp ON u.id = upp.paciente
        WHERE upp.psicologo = $1 
          AND e.fecha_creacion >= $2
        ORDER BY e.fecha_creacion DESC
      `;
      params = [psicologoIdInt, fechaInicio];
    } else {
      // Si no se especifica psicólogo, obtener todos (para admin)
      query = `
        SELECT 
          e.id,
          e.estado,
          e.comentario,
          e.fecha_creacion,
          e.id_usuario,
          u.usuario as nombre_usuario
        FROM estados e
        INNER JOIN usuarios u ON e.id_usuario = u.id
        WHERE e.fecha_creacion >= $1
        ORDER BY e.fecha_creacion DESC
      `;
      params = [fechaInicio];
    }
    
    const resultado = await baseDatos.query(query, params);
    
    console.log(`Encontrados ${resultado.rows.length} estados de ánimo`);
    
    res.json({
      success: true,
      data: resultado.rows
    });
    
  } catch (error) {
    console.error('Error al obtener todos los estados:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener estados',
      detalle: error.message 
    });
  }
});

app.get('/api/estados-animo/:usuarioid', async (req, res) => {
  const { usuarioid } = req.params;
  
  // Validar que usuarioid sea un número
  if (isNaN(usuarioid)) {
    return res.status(400).json({ 
      error: 'El ID de usuario debe ser un número',
      detalle: `Valor recibido: ${usuarioid}`
    });
  }
  
  try {
    const resultado = await baseDatos.query(`
      SELECT * FROM estados
      WHERE id_usuario = $1 
    `, [parseInt(usuarioid)]);
    
    console.log('Encontrados:', resultado.rows.length, 'estados de animo');
    
    res.json({
      success: true,
      data: resultado.rows
    });
    
  } catch (error) {
    console.log('Fallo');
  console.error('Error al guardar estado de ánimo:', error); 
  res.status(500).json({ 
    error: 'Error al guardar',
    detalle: error.message 
  });
}
});

// RUTA PARA OBTENER PSICÓLOGOS
app.get('/api/psicologos', async (req, res) => {
  console.log('Solicitando todos los psicólogos...');
  
  try {
    const resultado = await baseDatos.query(`
      SELECT p.*, u.usuario as email_usuario
      FROM psicologos p
      LEFT JOIN usuarios u ON p.codigo_usuario = u.id
      ORDER BY p.codigo DESC
    `);
    
    console.log(`Encontrados ${resultado.rows.length} psicólogos`);
    
    res.json({
      success: true,
      data: resultado.rows
    });
    
  } catch (error) {
    console.error('Error al obtener psicólogos:', error.message);
    
    res.status(500).json({ 
      error: 'No se pudieron obtener los psicólogos',
      detalle: error.message 
    });
  }
});

// ==================== MÉTODOS PARA METAS ====================

// GET: Obtener todas las metas de un usuario
app.get('/api/metas/usuario/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  console.log(`Obteniendo metas del usuario: ${usuarioId}`);
  
  try {
    const resultado = await baseDatos.query(`
      SELECT 
        codigo as id,
        titulo,
        descripcion,
        fecha_objetivo,
        hora_objetivo,
        esta_completado,
        fecha_creacion,
        id_usuario
      FROM metas
      WHERE id_usuario = $1
      ORDER BY codigo DESC
    `, [usuarioId]);
    
    console.log(`Encontradas ${resultado.rows.length} metas`);
    
    // Convertir formato de fecha y hora para compatibilidad
    const metas = resultado.rows.map(meta => ({
      id: meta.id,
      titulo: meta.titulo,
      descripcion: meta.descripcion,
      fecha_objetivo: meta.fecha_objetivo ? new Date(meta.fecha_objetivo).toISOString() : null,
      hora_objetivo: meta.hora_objetivo ? meta.hora_objetivo : '00:00',
      esta_completado: meta.esta_completado || false,
      fecha_creacion: meta.fecha_creacion ? new Date(meta.fecha_creacion).toISOString() : new Date().toISOString(),
      id_usuario: meta.id_usuario
    }));
    
    res.json(metas);
    
  } catch (error) {
    console.error('Error al obtener metas:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener metas',
      detalle: error.message 
    });
  }
});

// POST: Crear una nueva meta
app.post('/api/metas', async (req, res) => {
  console.log('Body completo:', req.body);
  
  const { titulo, descripcion, fecha_objetivo, hora_objetivo, esta_completado, fecha_creacion, id_usuario, usuario_email } = req.body;
  
  // Validación mejorada
  if (!titulo) {
    return res.status(400).json({ 
      error: 'El título es obligatorio' 
    });
  }
  
  if (!fecha_objetivo) {
    return res.status(400).json({ 
      error: 'La fecha objetivo es obligatoria' 
    });
  }
  
  try {
    // Obtener id_usuario desde el email si no viene directamente
    let idUsuarioFinal = id_usuario;
    
    console.log('id_usuario recibido:', id_usuario);
    console.log('usuario_email recibido:', usuario_email);
    
    if ((!idUsuarioFinal || idUsuarioFinal === null || idUsuarioFinal === 0) && usuario_email) {
      console.log('Buscando ID de usuario por email:', usuario_email);
      const usuarioResult = await baseDatos.query(`
        SELECT id FROM usuarios WHERE usuario = $1
      `, [usuario_email]);
      
      console.log('Resultados de búsqueda:', usuarioResult.rows.length);
      
      if (usuarioResult.rows.length === 0) {
        console.error('Usuario no encontrado con email:', usuario_email);
        return res.status(404).json({ 
          error: `Usuario no encontrado con email: ${usuario_email}` 
        });
      }
      
      idUsuarioFinal = usuarioResult.rows[0].id;
      console.log('ID de usuario encontrado:', idUsuarioFinal);
    }
    
    if (!idUsuarioFinal || idUsuarioFinal === null || idUsuarioFinal === 0) {
      console.error('id_usuario es null, undefined o 0');
      console.error('id_usuario recibido:', id_usuario);
      console.error('usuario_email recibido:', usuario_email);
      return res.status(400).json({ 
        error: 'El id_usuario es obligatorio. Proporciona id_usuario o usuario_email válido' 
      });
    }
    
    console.log('id_usuario final a usar:', idUsuarioFinal, 'Tipo:', typeof idUsuarioFinal);
    
    // Convertir fecha_objetivo de ISO string a DATE
    const fechaObj = new Date(fecha_objetivo);
    const fechaFormateada = fechaObj.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // hora_objetivo viene como "HH:mm"
    const horaFormateada = hora_objetivo || '00:00';
    
    // Convertir fecha_creacion si viene, sino usar CURRENT_DATE
    const fechaCreacion = fecha_creacion ? new Date(fecha_creacion).toISOString().split('T')[0] : null;
    
    console.log('Insertando meta con datos:');
    console.log('  - titulo:', titulo);
    console.log('  - fecha_objetivo:', fechaFormateada);
    console.log('  - hora_objetivo:', horaFormateada);
    console.log('  - id_usuario:', idUsuarioFinal);
    
    const resultado = await baseDatos.query(`
      INSERT INTO metas (
        titulo, 
        descripcion, 
        fecha_objetivo, 
        hora_objetivo, 
        esta_completado, 
        fecha_creacion, 
        id_usuario
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING codigo, titulo, descripcion, fecha_objetivo, hora_objetivo, esta_completado, fecha_creacion, id_usuario
    `, [
      titulo,
      descripcion || '',
      fechaFormateada,
      horaFormateada,
      esta_completado || false,
      fechaCreacion,
      idUsuarioFinal
    ]);
    
    console.log('Meta insertada correctamente. Filas afectadas:', resultado.rows.length);
    const nuevaMeta = resultado.rows[0];
    console.log('Meta creada con código:', nuevaMeta.codigo);
    
    // Convertir a formato esperado por Flutter (codigo -> id)
    const metaResponse = {
      id: nuevaMeta.codigo,
      titulo: nuevaMeta.titulo,
      descripcion: nuevaMeta.descripcion,
      fecha_objetivo: new Date(nuevaMeta.fecha_objetivo).toISOString(),
      hora_objetivo: nuevaMeta.hora_objetivo || '00:00',
      esta_completado: nuevaMeta.esta_completado || false,
      fecha_creacion: nuevaMeta.fecha_creacion ? new Date(nuevaMeta.fecha_creacion).toISOString() : new Date().toISOString(),
      id_usuario: nuevaMeta.id_usuario
    };
    
    console.log('Meta creada:', metaResponse.id);
    res.status(201).json(metaResponse);
    
  } catch (error) {
    console.error('Error completo al crear meta:');
    console.error('  - Mensaje:', error.message);
    console.error('  - Stack:', error.stack);
    console.error('  - Código:', error.code);
    res.status(500).json({ 
      error: 'Error al crear meta',
      detalle: error.message,
      codigo: error.code
    });
  }
});

// PUT: Actualizar una meta
app.put('/api/metas/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, fecha_objetivo, hora_objetivo, esta_completado } = req.body;
  
  console.log(`Actualizando meta ${id}:`, { titulo, fecha_objetivo });
  
  try {
    const fechaObj = fecha_objetivo ? new Date(fecha_objetivo) : null;
    const fechaFormateada = fechaObj ? fechaObj.toISOString().split('T')[0] : null;
    const horaFormateada = hora_objetivo || '00:00';
    
    const resultado = await baseDatos.query(`
      UPDATE metas 
      SET titulo = $1, 
          descripcion = $2, 
          fecha_objetivo = $3, 
          hora_objetivo = $4, 
          esta_completado = $5
      WHERE codigo = $6 
      RETURNING codigo, titulo, descripcion, fecha_objetivo, hora_objetivo, esta_completado, fecha_creacion, id_usuario
    `, [titulo, descripcion, fechaFormateada, horaFormateada, esta_completado, id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Meta no encontrada' });
    }
    
    const metaActualizada = resultado.rows[0];
    
    const metaResponse = {
      id: metaActualizada.codigo,
      titulo: metaActualizada.titulo,
      descripcion: metaActualizada.descripcion,
      fecha_objetivo: new Date(metaActualizada.fecha_objetivo).toISOString(),
      hora_objetivo: metaActualizada.hora_objetivo || '00:00',
      esta_completado: metaActualizada.esta_completado || false,
      fecha_creacion: metaActualizada.fecha_creacion ? new Date(metaActualizada.fecha_creacion).toISOString() : new Date().toISOString(),
      id_usuario: metaActualizada.id_usuario
    };
    
    console.log('Meta actualizada');
    res.json(metaResponse);
    
  } catch (error) {
    console.error('Error al actualizar meta:', error.message);
    res.status(500).json({ 
      error: 'Error al actualizar meta',
      detalle: error.message 
    });
  }
});

// DELETE: Eliminar una meta
app.delete('/api/metas/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Eliminando meta ${id}`);
  
  try {
    const resultado = await baseDatos.query(`
      DELETE FROM metas 
      WHERE codigo = $1 
      RETURNING codigo
    `, [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Meta no encontrada' });
    }
    
    console.log('Meta eliminada');
    res.json({ success: true });
    
  } catch (error) {
    console.error('Error al eliminar meta:', error.message);
    res.status(500).json({ 
      error: 'Error al eliminar meta',
      detalle: error.message 
    });
  }
});

// ==================== MÉTODOS PARA RECORDATORIOS ====================

// GET: Obtener todos los recordatorios de un usuario
app.get('/api/recordatorios/usuario/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  console.log(`Obteniendo recordatorios del usuario: ${usuarioId}`);
  
  try {
    const resultado = await baseDatos.query(`
      SELECT 
        codigo as id,
        titulo,
        descripcion,
        hora,
        dias_semana,
        fecha_recordatorio,
        esta_activo,
        fecha_creacion,
        id_usuario
      FROM recordatorios
      WHERE id_usuario = $1
      ORDER BY codigo DESC
    `, [usuarioId]);
    
    console.log(`Encontrados ${resultado.rows.length} recordatorios`);
    
    // Convertir formato para compatibilidad
    const recordatorios = resultado.rows.map(rec => {
      // Asegurar que la hora se formatee correctamente
      let horaFormateada = '00:00';
      if (rec.hora) {
        // Si viene como string, usarlo directamente
        if (typeof rec.hora === 'string') {
          horaFormateada = rec.hora.substring(0, 5); // Tomar solo HH:mm
        } else if (rec.hora instanceof Date) {
          // Si viene como Date, extraer hora y minutos
          const horas = rec.hora.getHours().toString().padStart(2, '0');
          const minutos = rec.hora.getMinutes().toString().padStart(2, '0');
          horaFormateada = `${horas}:${minutos}`;
        } else {
          // Intentar convertir a string y tomar los primeros 5 caracteres
          const horaStr = String(rec.hora);
          horaFormateada = horaStr.length >= 5 ? horaStr.substring(0, 5) : horaStr;
        }
      }
      
      return {
        id: rec.id,
        titulo: rec.titulo,
        descripcion: rec.descripcion || '',
        hora: horaFormateada,
        dias_semana: rec.dias_semana || null,
        fecha_recordatorio: rec.fecha_recordatorio ? new Date(rec.fecha_recordatorio).toISOString() : null,
        esta_activo: rec.esta_activo !== false, // true por defecto
        fecha_creacion: rec.fecha_creacion ? new Date(rec.fecha_creacion).toISOString() : new Date().toISOString(),
        id_usuario: rec.id_usuario
      };
    });
    
    res.json(recordatorios);
    
  } catch (error) {
    console.error('Error al obtener recordatorios:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener recordatorios',
      detalle: error.message 
    });
  }
});

// POST: Crear un nuevo recordatorio
app.post('/api/recordatorios', async (req, res) => {
  console.log('Body completo:', req.body);
  
  const { titulo, descripcion, hora, dias_semana, fecha_recordatorio, esta_activo, fecha_creacion, id_usuario, usuario_email } = req.body;
  
  // Validar campos obligatorios
  if (!titulo || !hora) {
    return res.status(400).json({ 
      error: 'Título y hora son obligatorios' 
    });
  }
  
  // Validar que tenga o dias_semana (para repetir) o fecha_recordatorio (para una vez)
  if (!dias_semana && !fecha_recordatorio) {
    return res.status(400).json({ 
      error: 'Debe proporcionar dias_semana (para repetir) o fecha_recordatorio (para una vez)' 
    });
  }
  
  try {
    // Obtener id_usuario desde el email si no viene directamente
    let idUsuarioFinal = id_usuario;
    
    if (!idUsuarioFinal && usuario_email) {
      console.log('🔍 Buscando ID de usuario por email:', usuario_email);
      const usuarioResult = await baseDatos.query(`
        SELECT id FROM usuarios WHERE usuario = $1
      `, [usuario_email]);
      
      if (usuarioResult.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Usuario no encontrado' 
        });
      }
      
      idUsuarioFinal = usuarioResult.rows[0].id;
      console.log('ID de usuario encontrado:', idUsuarioFinal);
    }
    
    if (!idUsuarioFinal || idUsuarioFinal === null) {
      return res.status(400).json({ 
        error: 'El id_usuario es obligatorio. Proporciona id_usuario o usuario_email' 
      });
    }
    
    // hora viene como "HH:mm"
    const horaFormateada = hora || '00:00';
    
    // dias_semana viene como string separado por comas: "1,2,3" o null/undefined
    const diasFormateados = dias_semana || null;
    
    // fecha_recordatorio viene como ISO string o null/undefined
    let fechaRecordatorioFormateada = null;
    if (fecha_recordatorio) {
      try {
        fechaRecordatorioFormateada = new Date(fecha_recordatorio).toISOString();
      } catch (e) {
        console.error('Error al parsear fecha_recordatorio:', e);
        return res.status(400).json({ 
          error: 'Formato de fecha_recordatorio inválido' 
        });
      }
    }
    
    console.log('Insertando recordatorio:');
    console.log('  - titulo:', titulo);
    console.log('  - hora recibida:', hora);
    console.log('  - hora formateada:', horaFormateada);
    console.log('  - dias_semana:', diasFormateados);
    console.log('  - fecha_recordatorio:', fechaRecordatorioFormateada);
    console.log('  - id_usuario:', idUsuarioFinal);
    
    const resultado = await baseDatos.query(`
      INSERT INTO recordatorios (
        titulo, 
        descripcion, 
        hora, 
        dias_semana, 
        fecha_recordatorio,
        esta_activo, 
        fecha_creacion, 
        id_usuario
      ) 
      VALUES ($1, $2, $3::TIME, $4, $5, $6, $7, $8) 
      RETURNING codigo, titulo, descripcion, hora, dias_semana, fecha_recordatorio, esta_activo, fecha_creacion, id_usuario
    `, [
      titulo,
      descripcion || '',
      horaFormateada,
      diasFormateados,
      fechaRecordatorioFormateada,
      esta_activo !== false, // true por defecto
      fecha_creacion ? new Date(fecha_creacion).toISOString() : new Date().toISOString(),
      idUsuarioFinal
    ]);
    
    const nuevoRecordatorio = resultado.rows[0];
    
    // Convertir a formato esperado por Flutter (codigo -> id)
    const recResponse = {
      id: nuevoRecordatorio.codigo,
      titulo: nuevoRecordatorio.titulo,
      descripcion: nuevoRecordatorio.descripcion || '',
      hora: nuevoRecordatorio.hora ? (typeof nuevoRecordatorio.hora === 'string' ? nuevoRecordatorio.hora : String(nuevoRecordatorio.hora).substring(0, 5)) : '00:00',
      dias_semana: nuevoRecordatorio.dias_semana || null,
      fecha_recordatorio: nuevoRecordatorio.fecha_recordatorio ? new Date(nuevoRecordatorio.fecha_recordatorio).toISOString() : null,
      esta_activo: nuevoRecordatorio.esta_activo !== false,
      fecha_creacion: nuevoRecordatorio.fecha_creacion ? new Date(nuevoRecordatorio.fecha_creacion).toISOString() : new Date().toISOString(),
      id_usuario: nuevoRecordatorio.id_usuario
    };
    
    console.log('Recordatorio creado:', recResponse.id);
    res.status(201).json(recResponse);
    
  } catch (error) {
    console.error('❌ Error al crear recordatorio:', error.message);
    res.status(500).json({ 
      error: 'Error al crear recordatorio',
      detalle: error.message 
    });
  }
});

// PUT: Actualizar un recordatorio
app.put('/api/recordatorios/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, hora, dias_semana, esta_activo } = req.body;
  
  console.log(`Actualizando recordatorio ${id}`);
  
  try {
    const resultado = await baseDatos.query(`
      UPDATE recordatorios 
      SET titulo = $1, 
          descripcion = $2, 
          hora = $3, 
          dias_semana = $4, 
          esta_activo = $5
      WHERE codigo = $6 
      RETURNING codigo, titulo, descripcion, hora, dias_semana, esta_activo, fecha_creacion, id_usuario
    `, [titulo, descripcion, hora, dias_semana, esta_activo, id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Recordatorio no encontrado' });
    }
    
    const recActualizado = resultado.rows[0];
    
    const recResponse = {
      id: recActualizado.codigo,
      titulo: recActualizado.titulo,
      descripcion: recActualizado.descripcion || '',
      hora: recActualizado.hora || '00:00',
      dias_semana: recActualizado.dias_semana || '',
      esta_activo: recActualizado.esta_activo !== false,
      fecha_creacion: recActualizado.fecha_creacion ? new Date(recActualizado.fecha_creacion).toISOString() : new Date().toISOString(),
      id_usuario: recActualizado.id_usuario
    };
    
    console.log('Recordatorio actualizado');
    res.json(recResponse);
    
  } catch (error) {
    console.error('Error al actualizar recordatorio:', error.message);
    res.status(500).json({ 
      error: 'Error al actualizar recordatorio',
      detalle: error.message 
    });
  }
});

// DELETE: Eliminar un recordatorio
app.delete('/api/recordatorios/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Eliminando recordatorio ${id}`);
  
  try {
    const resultado = await baseDatos.query(`
      DELETE FROM recordatorios 
      WHERE codigo = $1 
      RETURNING codigo
    `, [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Recordatorio no encontrado' });
    }
    
    console.log('Recordatorio eliminado');
    res.json({ success: true });
    
  } catch (error) {
    console.error('Error al eliminar recordatorio:', error.message);
    res.status(500).json({ 
      error: 'Error al eliminar recordatorio',
      detalle: error.message 
    });
  }
});

   // ==================== RELACIÓN PSICÓLOGO - PACIENTE ====================
   app.get('/api/Registrarpaciente', async (req, res) => {
     try {
       console.log('Obteniendo relaciones psicólogo-paciente');
       
       const resultado = await baseDatos.query(`
         SELECT 
           pp.psicologo,
           pp.paciente,
           u.usuario AS paciente_usuario
         FROM usuarios_por_psicologo pp
         LEFT JOIN usuarios u ON u.id = pp.paciente
         ORDER BY pp.psicologo, pp.paciente
       `);

       console.log(`Encontradas ${resultado.rows.length} relaciones`);
       
       // Devolver directamente la lista para compatibilidad con Flutter
       res.json(resultado.rows);
     } catch (error) {
       console.error('Error al obtener relaciones:', error.message);
       console.error('Stack:', error.stack);
       res.status(500).json({ 
         error: 'No se pudieron obtener las relaciones',
         detalle: error.message 
       });
     }
   });

   app.post('/api/Registrarpaciente', async (req, res) => {
     console.log('Petición recibida en /api/Registrarpaciente');
     console.log('Body completo:', req.body);

     const { id_psicologo, id_paciente } = req.body;

     if (!id_psicologo || !id_paciente) {
       console.log('Faltan datos obligatorios');
       return res.status(400).json({
         error: 'id_psicologo e id_paciente son obligatorios',
       });
     }

     try {
       // Convertir a enteros para asegurar el tipo correcto
       const psicologoId = parseInt(id_psicologo);
       const pacienteId = parseInt(id_paciente);
       
       // Validar que sean números válidos
       if (isNaN(psicologoId) || isNaN(pacienteId)) {
         return res.status(400).json({
           error: 'id_psicologo e id_paciente deben ser números válidos',
         });
       }
       
      // Validar que el psicólogo exista y sea tipo_usuario = 2
      // Manejar tanto VARCHAR como INTEGER para tipo_usuario
      const psicologo = await baseDatos.query(
        `SELECT id FROM usuarios WHERE id = $1 AND (tipo_usuario::TEXT = '2' OR tipo_usuario::INTEGER = 2)`,
        [psicologoId]
      );
      if (psicologo.rows.length === 0) {
        return res.status(404).json({ error: 'Psicólogo no encontrado o no es tipo_usuario = 2' });
      }

      // Validar que el paciente exista y sea tipo_usuario = 1
      // Manejar tanto VARCHAR como INTEGER para tipo_usuario
      const paciente = await baseDatos.query(
        `SELECT id 
        FROM usuarios 
        WHERE id = $1 
        AND (tipo_usuario::TEXT = '1' OR tipo_usuario::INTEGER = 1)`,
        [pacienteId]
      );

      if (paciente.rows.length === 0) {
        return res.status(400).json({
          error: 'El paciente no existe o no es tipo_usuario = 1',
        });
      }

      // Evitar duplicados
      // Las columnas psicologo y paciente son INTEGER
      const existente = await baseDatos.query(
        `SELECT 1 FROM usuarios_por_psicologo WHERE psicologo = $1 AND paciente = $2`,
        [psicologoId, pacienteId]
      );
      
      if (existente.rows.length > 0) {
        return res.status(409).json({
          error: 'El paciente ya está asignado a este psicólogo',
        });
      }

      // Insertar relación
      // Las columnas psicologo y paciente son INTEGER
      const resultado = await baseDatos.query(
        `INSERT INTO usuarios_por_psicologo (psicologo, paciente)
         VALUES ($1, $2)
         RETURNING *`,
        [psicologoId, pacienteId]
      );

       res.status(201).json({
         success: true,
         data: resultado.rows[0],
       });
     } catch (error) {
       console.error('Error al registrar relación:', error.message);
       res.status(500).json({
         error: 'No se pudo registrar la relación',
         detalle: error.message,
       });
     }
   });

   app.delete('/api/Registrarpaciente/:psicologoId/:pacienteId', async (req, res) => {
     const { psicologoId, pacienteId } = req.params;

     try {
       // Convertir a enteros
       const psicologoIdInt = parseInt(psicologoId);
       const pacienteIdInt = parseInt(pacienteId);
       
       if (isNaN(psicologoIdInt) || isNaN(pacienteIdInt)) {
         return res.status(400).json({ 
           error: 'psicologoId y pacienteId deben ser números válidos' 
         });
       }
       
       const resultado = await baseDatos.query(
         `DELETE FROM usuarios_por_psicologo
          WHERE psicologo = $1 AND paciente = $2
          RETURNING *`,
         [psicologoIdInt, pacienteIdInt]
       );

       if (resultado.rows.length === 0) {
         return res.status(404).json({ error: 'Relación no encontrada' });
       }

       res.json({ success: true });
     } catch (error) {
       console.error('Error al eliminar relación:', error.message);
       res.status(500).json({
         error: 'No se pudo eliminar la relación',
         detalle: error.message,
       });
     }
   });

   // ==================== ENDPOINTS PARA REPORTES DE ESTADOS DE ÁNIMO ====================

// GET: Obtener estados de ánimo por período de un usuario específico
app.get('/api/estados-animo/:usuarioId/periodo', async (req, res) => {
  const { usuarioId } = req.params;
  const { fecha_inicio } = req.query;
  
  console.log(`Obteniendo estados de ánimo del usuario ${usuarioId} desde ${fecha_inicio}`);
  
  try {
    const fechaInicio = fecha_inicio || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const resultado = await baseDatos.query(`
      SELECT 
        e.id,
        e.estado,
        e.comentario,
        e.fecha_creacion,
        e.id_usuario,
        u.usuario as nombre_usuario
      FROM estados e
      INNER JOIN usuarios u ON e.id_usuario = u.id
      WHERE e.id_usuario = $1 
        AND e.fecha_creacion >= $2
      ORDER BY e.fecha_creacion DESC
    `, [usuarioId, fechaInicio]);
    
    console.log(`Encontrados ${resultado.rows.length} estados de ánimo`);
    
    res.json({
      success: true,
      data: resultado.rows
    });
    
  } catch (error) {
    console.error('Error al obtener estados por período:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener estados',
      detalle: error.message 
    });
  }
});

// GET: Obtener lista de pacientes de un psicólogo con sus estadísticas
app.get('/api/psicologo/:psicologoId/pacientes', async (req, res) => {
  const { psicologoId } = req.params;
  
  console.log(`Obteniendo pacientes del psicólogo ${psicologoId}`);
  
  try {
    // Convertir a entero
    const psicologoIdInt = parseInt(psicologoId);
    
    if (isNaN(psicologoIdInt)) {
      return res.status(400).json({ 
        error: 'psicologoId debe ser un número válido' 
      });
    }
    
    const resultado = await baseDatos.query(`
      SELECT 
        u.id,
        u.usuario as nombre,
        COUNT(e.id) as total_estados,
        AVG(e.estado) as promedio_estados,
        MAX(e.fecha_creacion) as ultimo_registro
      FROM usuarios u
      INNER JOIN usuarios_por_psicologo upp ON u.id = upp.paciente
      LEFT JOIN estados e ON u.id = e.id_usuario
      WHERE upp.psicologo = $1
      GROUP BY u.id, u.usuario
      ORDER BY u.usuario
    `, [psicologoIdInt]);
    
    console.log(`Encontrados ${resultado.rows.length} pacientes`);
    
    res.json({
      success: true,
      pacientes: resultado.rows
    });
    
  } catch (error) {
    console.error('Error al obtener pacientes:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener pacientes',
      detalle: error.message 
    });
  }
});

// GET: Obtener estadísticas de estados de ánimo
app.get('/api/estados-animo/estadisticas', async (req, res) => {
  const { usuario_id, fecha_inicio, psicologo_id } = req.query;
  
  console.log('Obteniendo estadísticas de estados de ánimo');
  console.log('Usuario ID:', usuario_id);
  console.log('Psicólogo ID:', psicologo_id);
  console.log('Fecha inicio:', fecha_inicio);
  
  try {
    const fechaInicio = fecha_inicio || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    // Construir query dinámicamente según los parámetros
    let whereConditions = ['e.fecha_creacion >= $1'];
    let params = [fechaInicio];
    let paramIndex = 2;
    
    let fromClause = 'FROM estados e INNER JOIN usuarios u ON e.id_usuario = u.id';
    
    if (psicologo_id) {
      // Si es psicólogo, filtrar por sus pacientes
      fromClause += ' INNER JOIN usuarios_por_psicologo upp ON u.id = upp.paciente';
      whereConditions.push(`upp.psicologo = $${paramIndex}`);
      params.push(psicologo_id);
      paramIndex++;
    }
    
    if (usuario_id) {
      // Si se especifica usuario, filtrar por ese usuario
      whereConditions.push(`e.id_usuario = $${paramIndex}`);
      params.push(usuario_id);
      paramIndex++;
    }
    
    const whereClause = 'WHERE ' + whereConditions.join(' AND ');
    
    // Obtener estadísticas generales
    const queryEstadisticas = `
      SELECT 
        COUNT(*) as total_registros,
        ROUND(AVG(e.estado)::numeric, 2) as promedio,
        MIN(e.estado) as minimo,
        MAX(e.estado) as maximo,
        SUM(CASE WHEN e.estado = 1 THEN 1 ELSE 0 END) as muy_triste,
        SUM(CASE WHEN e.estado = 2 THEN 1 ELSE 0 END) as triste,
        SUM(CASE WHEN e.estado = 3 THEN 1 ELSE 0 END) as neutral,
        SUM(CASE WHEN e.estado = 4 THEN 1 ELSE 0 END) as feliz,
        SUM(CASE WHEN e.estado = 5 THEN 1 ELSE 0 END) as muy_feliz
      ${fromClause}
      ${whereClause}
    `;
    
    const resultadoEstadisticas = await baseDatos.query(queryEstadisticas, params);
    
    // Obtener tendencia diaria
    const queryTendencia = `
      SELECT 
        DATE(e.fecha_creacion) as fecha,
        ROUND(AVG(e.estado)::numeric, 2) as promedio,
        COUNT(*) as cantidad
      ${fromClause}
      ${whereClause}
      GROUP BY DATE(e.fecha_creacion)
      ORDER BY fecha
    `;
    
    const resultadoTendencia = await baseDatos.query(queryTendencia, params);
    
    // Obtener distribución por día de la semana
    const queryDiaSemana = `
      SELECT 
        TO_CHAR(e.fecha_creacion, 'Day') as dia_semana,
        EXTRACT(DOW FROM e.fecha_creacion) as dia_numero,
        ROUND(AVG(e.estado)::numeric, 2) as promedio,
        COUNT(*) as cantidad
      ${fromClause}
      ${whereClause}
      GROUP BY TO_CHAR(e.fecha_creacion, 'Day'), EXTRACT(DOW FROM e.fecha_creacion)
      ORDER BY dia_numero
    `;
    
    const resultadoDiaSemana = await baseDatos.query(queryDiaSemana, params);
    
    console.log('Estadísticas calculadas exitosamente');
    
    res.json({
      success: true,
      estadisticas: resultadoEstadisticas.rows[0],
      tendencia: resultadoTendencia.rows,
      por_dia_semana: resultadoDiaSemana.rows
    });
    
  } catch (error) {
    console.error('Error al obtener estadísticas:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas',
      detalle: error.message 
    });
  }
});

// GET: Obtener resumen de paciente específico
app.get('/api/estados-animo/:usuarioId/resumen', async (req, res) => {
  const { usuarioId } = req.params;
  const { fecha_inicio } = req.query;
  
  console.log(`Obteniendo resumen del usuario ${usuarioId}`);
  
  try {
    const fechaInicio = fecha_inicio || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    // Estadísticas generales del paciente
    const resumen = await baseDatos.query(`
      SELECT 
        u.id,
        u.usuario as nombre,
        COUNT(e.id) as total_registros,
        ROUND(AVG(e.estado)::numeric, 2) as promedio_general,
        MIN(e.estado) as estado_minimo,
        MAX(e.estado) as estado_maximo,
        MAX(e.fecha_creacion) as ultimo_registro
      FROM usuarios u
      LEFT JOIN estados e ON u.id = e.id_usuario 
        AND e.fecha_creacion >= $2
      WHERE u.id = $1
      GROUP BY u.id, u.usuario
    `, [usuarioId, fechaInicio]);
    
    // Últimos 7 días de actividad
    const actividadReciente = await baseDatos.query(`
      SELECT 
        DATE(e.fecha_creacion) as fecha,
        COUNT(*) as registros,
        ROUND(AVG(e.estado)::numeric, 2) as promedio
      FROM estados e
      WHERE e.id_usuario = $1 
        AND e.fecha_creacion >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(e.fecha_creacion)
      ORDER BY fecha DESC
    `, [usuarioId]);
    
    // Estado emocional más frecuente
    const estadoFrecuente = await baseDatos.query(`
      SELECT 
        e.estado,
        COUNT(*) as frecuencia,
        CASE 
          WHEN e.estado = 1 THEN 'Muy Triste'
          WHEN e.estado = 2 THEN 'Triste'
          WHEN e.estado = 3 THEN 'Neutral'
          WHEN e.estado = 4 THEN 'Feliz'
          WHEN e.estado = 5 THEN 'Muy Feliz'
        END as descripcion
      FROM estados e
      WHERE e.id_usuario = $1 
        AND e.fecha_creacion >= $2
      GROUP BY e.estado
      ORDER BY frecuencia DESC
      LIMIT 1
    `, [usuarioId, fechaInicio]);
    
    res.json({
      success: true,
      resumen: resumen.rows[0],
      actividad_reciente: actividadReciente.rows,
      estado_mas_frecuente: estadoFrecuente.rows[0] || null
    });
    
  } catch (error) {
    console.error('Error al obtener resumen:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener resumen',
      detalle: error.message 
    });
  }
});

// GET: Comparar dos pacientes (para psicólogos)
app.get('/api/estados-animo/comparar', async (req, res) => {
  const { usuario_id_1, usuario_id_2, fecha_inicio } = req.query;
  
  if (!usuario_id_1 || !usuario_id_2) {
    return res.status(400).json({ 
      error: 'Se requieren dos IDs de usuario para comparar' 
    });
  }
  
  console.log(`Comparando usuarios ${usuario_id_1} y ${usuario_id_2}`);
  
  try {
    const fechaInicio = fecha_inicio || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const comparacion = await baseDatos.query(`
      SELECT 
        u.id,
        u.usuario as nombre,
        COUNT(e.id) as total_registros,
        ROUND(AVG(e.estado)::numeric, 2) as promedio,
        MIN(e.estado) as minimo,
        MAX(e.estado) as maximo
      FROM usuarios u
      LEFT JOIN estados e ON u.id = e.id_usuario 
        AND e.fecha_creacion >= $3
      WHERE u.id IN ($1, $2)
      GROUP BY u.id, u.usuario
      ORDER BY u.id
    `, [usuario_id_1, usuario_id_2, fechaInicio]);
    
    res.json({
      success: true,
      comparacion: comparacion.rows
    });
    
  } catch (error) {
    console.error('Error al comparar usuarios:', error.message);
    res.status(500).json({ 
      error: 'Error al comparar usuarios',
      detalle: error.message 
    });
  }
});

console.log('✅ Endpoints de reportes de estados de ánimo cargados');

// PROBAR CONEXIÓN A LA BASE DE DATOS
async function probarConexion() {
  try {
    const resultado = await baseDatos.query('SELECT NOW()');
    console.log('Conexión a PostgreSQL exitosa:', resultado.rows[0].now);
  } catch (error) {
    console.error('Error conectando a PostgreSQL:', error.message);
    console.log('Verifica que PostgreSQL esté ejecutándose y que las credenciales sean correctas');
  }
}

// INICIAR EL SERVIDOR
// Escuchar en 0.0.0.0 para permitir conexiones desde cualquier IP (necesario en Railway)
app.listen(puerto, '0.0.0.0', () => {
  console.log('═══════════════════════════════════');
  console.log('🚀 Servidor iniciado');
  console.log(`📍 Puerto: ${puerto}`);
  console.log(`🌐 Modo: ${process.env.NODE_ENV || 'desarrollo'}`);
  console.log('═══════════════════════════════════');

  // Probar conexión a la base de datos
  probarConexion();
});

// MANEJO DE CIERRE 
process.on('SIGINT', async () => {
  await baseDatos.end();
  console.log('Conexiones cerradas');
  process.exit(0);
});