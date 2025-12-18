-- Script para crear Foreign Keys en las tablas de psicólogos y pacientes
-- Este script crea las relaciones entre las tablas y la tabla usuarios

-- ============================================================
-- 1. Foreign Key para la tabla usuarios_por_psicologo
-- ============================================================

-- FK: paciente -> usuarios.id (para usuarios tipo 1)
-- Primero verificamos si la FK ya existe antes de crearla
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'fk_usuarios_por_psicologo_paciente'
    ) THEN
        ALTER TABLE usuarios_por_psicologo
        ADD CONSTRAINT fk_usuarios_por_psicologo_paciente
        FOREIGN KEY (paciente) 
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;
        
        RAISE NOTICE 'FK fk_usuarios_por_psicologo_paciente creada exitosamente';
    ELSE
        RAISE NOTICE 'FK fk_usuarios_por_psicologo_paciente ya existe';
    END IF;
END $$;

-- FK: psicologo -> usuarios.id (para usuarios tipo 2)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'fk_usuarios_por_psicologo_psicologo'
    ) THEN
        ALTER TABLE usuarios_por_psicologo
        ADD CONSTRAINT fk_usuarios_por_psicologo_psicologo
        FOREIGN KEY (psicologo) 
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;
        
        RAISE NOTICE 'FK fk_usuarios_por_psicologo_psicologo creada exitosamente';
    ELSE
        RAISE NOTICE 'FK fk_usuarios_por_psicologo_psicologo ya existe';
    END IF;
END $$;

-- ============================================================
-- 2. Foreign Key para la tabla psicologos
-- ============================================================

-- FK: codigo_usuario -> usuarios.id (para usuarios tipo 2)
-- Nota: Si la columna se llama 'usuario_sistema' en lugar de 'codigo_usuario',
-- cambia el nombre de la columna en la siguiente línea
DO $$
BEGIN
    -- Primero verificamos qué columna existe
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'psicologos' 
        AND column_name = 'codigo_usuario'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_constraint 
            WHERE conname = 'fk_psicologos_codigo_usuario'
        ) THEN
            ALTER TABLE psicologos
            ADD CONSTRAINT fk_psicologos_codigo_usuario
            FOREIGN KEY (codigo_usuario) 
            REFERENCES usuarios(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;
            
            RAISE NOTICE 'FK fk_psicologos_codigo_usuario creada exitosamente';
        ELSE
            RAISE NOTICE 'FK fk_psicologos_codigo_usuario ya existe';
        END IF;
    ELSIF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'psicologos' 
        AND column_name = 'usuario_sistema'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_constraint 
            WHERE conname = 'fk_psicologos_usuario_sistema'
        ) THEN
            ALTER TABLE psicologos
            ADD CONSTRAINT fk_psicologos_usuario_sistema
            FOREIGN KEY (usuario_sistema) 
            REFERENCES usuarios(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;
            
            RAISE NOTICE 'FK fk_psicologos_usuario_sistema creada exitosamente';
        ELSE
            RAISE NOTICE 'FK fk_psicologos_usuario_sistema ya existe';
        END IF;
    ELSE
        RAISE NOTICE 'No se encontró la columna codigo_usuario ni usuario_sistema en la tabla psicologos';
    END IF;
END $$;

-- ============================================================
-- 3. Triggers para validar tipo_usuario (opcional pero recomendado)
-- ============================================================

-- Trigger para validar que paciente sea tipo_usuario = 1
CREATE OR REPLACE FUNCTION validar_paciente_tipo()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM usuarios 
        WHERE id = NEW.paciente 
        AND tipo_usuario = 1
    ) THEN
        RAISE EXCEPTION 'El paciente debe ser un usuario de tipo 1';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger si no existe
DROP TRIGGER IF EXISTS trigger_validar_paciente_tipo ON usuarios_por_psicologo;
CREATE TRIGGER trigger_validar_paciente_tipo
    BEFORE INSERT OR UPDATE ON usuarios_por_psicologo
    FOR EACH ROW
    EXECUTE FUNCTION validar_paciente_tipo();

-- Trigger para validar que psicologo sea tipo_usuario = 2
CREATE OR REPLACE FUNCTION validar_psicologo_tipo()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM usuarios 
        WHERE id = NEW.psicologo 
        AND tipo_usuario = 2
    ) THEN
        RAISE EXCEPTION 'El psicólogo debe ser un usuario de tipo 2';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger si no existe
DROP TRIGGER IF EXISTS trigger_validar_psicologo_tipo ON usuarios_por_psicologo;
CREATE TRIGGER trigger_validar_psicologo_tipo
    BEFORE INSERT OR UPDATE ON usuarios_por_psicologo
    FOR EACH ROW
    EXECUTE FUNCTION validar_psicologo_tipo();

-- Trigger para validar que codigo_usuario/usuario_sistema en psicologos sea tipo_usuario = 2
CREATE OR REPLACE FUNCTION validar_psicologo_usuario_tipo()
RETURNS TRIGGER AS $$
DECLARE
    usuario_id INTEGER;
BEGIN
    -- Obtener el ID del usuario (puede ser codigo_usuario o usuario_sistema)
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'psicologos' 
        AND column_name = 'codigo_usuario'
    ) THEN
        usuario_id := NEW.codigo_usuario;
    ELSIF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'psicologos' 
        AND column_name = 'usuario_sistema'
    ) THEN
        usuario_id := NEW.usuario_sistema;
    ELSE
        RETURN NEW; -- Si no existe ninguna columna, no validamos
    END IF;
    
    IF usuario_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 
        FROM usuarios 
        WHERE id = usuario_id 
        AND tipo_usuario = 2
    ) THEN
        RAISE EXCEPTION 'El usuario del psicólogo debe ser de tipo 2';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger si no existe
DROP TRIGGER IF EXISTS trigger_validar_psicologo_usuario_tipo ON psicologos;
CREATE TRIGGER trigger_validar_psicologo_usuario_tipo
    BEFORE INSERT OR UPDATE ON psicologos
    FOR EACH ROW
    EXECUTE FUNCTION validar_psicologo_usuario_tipo();

-- ============================================================
-- Mensaje final
-- ============================================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Script de Foreign Keys ejecutado exitosamente';
    RAISE NOTICE '========================================';
END $$;


