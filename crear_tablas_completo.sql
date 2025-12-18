-- ============================================================
-- SCRIPT COMPLETO PARA CREAR TODAS LAS TABLAS Y RELACIONES
-- ============================================================
-- Este script crea todas las tablas necesarias para MoodTrack
-- Ejecútalo en tu base de datos de Railway
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
-- ============================================================
-- Nota: Las columnas son VARCHAR para compatibilidad
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

-- ============================================================
-- 8. FOREIGN KEYS (Relaciones)
-- ============================================================

-- Foreign Key: usuarios_por_psicologo.paciente -> usuarios.id
-- Nota: Como paciente es VARCHAR, necesitamos convertir a INTEGER para la FK
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_usuarios_por_psicologo_paciente'
    ) THEN
        -- Crear una columna temporal INTEGER si no existe
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'usuarios_por_psicologo' 
            AND column_name = 'paciente_id'
        ) THEN
            ALTER TABLE usuarios_por_psicologo
            ADD COLUMN paciente_id INTEGER;
            
            -- Llenar la columna con los valores convertidos
            UPDATE usuarios_por_psicologo
            SET paciente_id = paciente::INTEGER
            WHERE paciente ~ '^[0-9]+$';
            
            -- Crear la FK usando la columna INTEGER
            ALTER TABLE usuarios_por_psicologo
            ADD CONSTRAINT fk_usuarios_por_psicologo_paciente
            FOREIGN KEY (paciente_id) 
            REFERENCES usuarios(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;
        END IF;
    END IF;
END $$;

-- Foreign Key: usuarios_por_psicologo.psicologo -> usuarios.id
-- Nota: Como psicologo es VARCHAR, necesitamos convertir a INTEGER para la FK
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_usuarios_por_psicologo_psicologo'
    ) THEN
        -- Crear una columna temporal INTEGER si no existe
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'usuarios_por_psicologo' 
            AND column_name = 'psicologo_id'
        ) THEN
            ALTER TABLE usuarios_por_psicologo
            ADD COLUMN psicologo_id INTEGER;
            
            -- Llenar la columna con los valores convertidos
            UPDATE usuarios_por_psicologo
            SET psicologo_id = psicologo::INTEGER
            WHERE psicologo ~ '^[0-9]+$';
            
            -- Crear la FK usando la columna INTEGER
            ALTER TABLE usuarios_por_psicologo
            ADD CONSTRAINT fk_usuarios_por_psicologo_psicologo
            FOREIGN KEY (psicologo_id) 
            REFERENCES usuarios(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;
        END IF;
    END IF;
END $$;

-- ============================================================
-- 9. TRIGGERS para validación
-- ============================================================

-- Trigger: Validar que paciente sea tipo_usuario = 1
-- Nota: Como paciente es VARCHAR, convertimos para la validación
CREATE OR REPLACE FUNCTION validar_paciente_tipo()
RETURNS TRIGGER AS $$
DECLARE
    paciente_id_val INTEGER;
BEGIN
    -- Convertir VARCHAR a INTEGER si es posible
    BEGIN
        paciente_id_val := NEW.paciente::INTEGER;
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'El paciente debe ser un número válido';
    END;
    
    IF NOT EXISTS (
        SELECT 1 FROM usuarios 
        WHERE id = paciente_id_val AND tipo_usuario = 1
    ) THEN
        RAISE EXCEPTION 'El paciente debe ser un usuario de tipo 1';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_validar_paciente_tipo ON usuarios_por_psicologo;
CREATE TRIGGER trigger_validar_paciente_tipo
    BEFORE INSERT OR UPDATE ON usuarios_por_psicologo
    FOR EACH ROW
    EXECUTE FUNCTION validar_paciente_tipo();

-- Trigger: Validar que psicologo sea tipo_usuario = 2
-- Nota: Como psicologo es VARCHAR, convertimos para la validación
CREATE OR REPLACE FUNCTION validar_psicologo_tipo()
RETURNS TRIGGER AS $$
DECLARE
    psicologo_id_val INTEGER;
BEGIN
    -- Convertir VARCHAR a INTEGER si es posible
    BEGIN
        psicologo_id_val := NEW.psicologo::INTEGER;
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'El psicólogo debe ser un número válido';
    END;
    
    IF NOT EXISTS (
        SELECT 1 FROM usuarios 
        WHERE id = psicologo_id_val AND tipo_usuario = 2
    ) THEN
        RAISE EXCEPTION 'El psicólogo debe ser un usuario de tipo 2';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_validar_psicologo_tipo ON usuarios_por_psicologo;
CREATE TRIGGER trigger_validar_psicologo_tipo
    BEFORE INSERT OR UPDATE ON usuarios_por_psicologo
    FOR EACH ROW
    EXECUTE FUNCTION validar_psicologo_tipo();

-- ============================================================
-- Mensaje de confirmación
-- ============================================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Todas las tablas y relaciones creadas exitosamente';
    RAISE NOTICE '========================================';
END $$;
