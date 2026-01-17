-- BaseDatos.sql
-- Script de creación de esquema para el proyecto
-- =================================================
-- Tabla: clientes
-- =================================================
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    genero VARCHAR(50),
    edad INT,
    identificacion VARCHAR(50) UNIQUE NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(50),
    contrasena VARCHAR(255),
    estado BOOLEAN
);

-- =================================================
-- Tabla: cuentas
-- =================================================
CREATE TABLE cuentas (
    id SERIAL PRIMARY KEY,
    numero_cuenta VARCHAR(50) UNIQUE NOT NULL,
    tipo_cuenta VARCHAR(50),
    saldo_inicial NUMERIC(15,2),
    estado BOOLEAN,
    cliente_id BIGINT,
    CONSTRAINT fk_cuenta_cliente FOREIGN KEY(cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- =================================================
-- Tabla: movimientos
-- =================================================
CREATE TABLE movimientos (
    id SERIAL PRIMARY KEY,
    fecha DATE,
    tipo_movimiento VARCHAR(20),
    valor NUMERIC(15,2),
    saldo NUMERIC(15,2),
    estado BOOLEAN,
    cuenta_id BIGINT,
    CONSTRAINT fk_movimiento_cuenta FOREIGN KEY(cuenta_id) REFERENCES cuentas(id) ON DELETE CASCADE
);

-- =================================================

CREATE TYPE tipo_movimiento AS ENUM ('DEPOSITO', 'RETIRO');

