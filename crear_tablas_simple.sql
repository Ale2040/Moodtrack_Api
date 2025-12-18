-- ============================================================
-- SCRIPT SIMPLE PARA CREAR TODAS LAS TABLAS
-- Ejecuta este script en Railway para crear todas las tablas
-- ============================================================

-- ============================================================
-- 1. TABLA: usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    tipo_usuario INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. TABLA: estados (Estados de ánimo)
-- ============================================================
CREATE TABLE IF NOT EXISTS estados (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    estado INTEGER NOT NULL CHECK (estado >= 1 AND estado <= 5),
    comentario TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- 3. TABLA: psicologos
-- ============================================================
CREATE TABLE IF NOT EXISTS psicologos (
    codigo SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    especialidad VARCHAR(255),
    nro_registro VARCHAR(255) UNIQUE,
    usuario_sistema INTEGER,
    FOREIGN KEY (usuario_sistema) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- 4. TABLA: usuarios_por_psicologo (Relación psicólogo-paciente)
-- Nota: Las columnas son VARCHAR para compatibilidad con el código existente
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios_por_psicologo (
    psicologo VARCHAR(255) NOT NULL,
    paciente VARCHAR(255) NOT NULL,
    PRIMARY KEY (psicologo, paciente)
);

-- ============================================================
-- 5. TABLA: metas (Objetivos)
-- ============================================================
CREATE TABLE IF NOT EXISTS metas (
    codigo SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_objetivo DATE NOT NULL,
    hora_objetivo TIME NOT NULL,
    esta_completado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- 6. TABLA: recordatorios
-- ============================================================
CREATE TABLE IF NOT EXISTS recordatorios (
    codigo SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    hora TIME NOT NULL,
    dias_semana INTEGER[], -- Array de días (1=Lunes, 7=Domingo)
    fecha_recordatorio TIMESTAMP, -- Para recordatorios "una vez"
    esta_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- 7. ÍNDICES para mejorar el rendimiento
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_estados_id_usuario ON estados(id_usuario);
CREATE INDEX IF NOT EXISTS idx_estados_fecha_creacion ON estados(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_metas_id_usuario ON metas(id_usuario);
CREATE INDEX IF NOT EXISTS idx_recordatorios_id_usuario ON recordatorios(id_usuario);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_usuarios_por_psicologo_psicologo ON usuarios_por_psicologo(psicologo);
CREATE INDEX IF NOT EXISTS idx_usuarios_por_psicologo_paciente ON usuarios_por_psicologo(paciente);

-- ============================================================
-- Mensaje de confirmación
-- ============================================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Todas las tablas creadas exitosamente';
    RAISE NOTICE '========================================';
END $$;
