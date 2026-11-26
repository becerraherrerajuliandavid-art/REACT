const pool = require('../database');

const Usuario = {};

// Lista los usuarios sin password_hash: nunca se envía al cliente
Usuario.listar = async () => {
  const [filas] = await pool.query(
    'SELECT id_usuario, nombre, apellido, email, estado, fecha_creacion FROM usuario'
  );
  return filas;
};

// Busca por email e incluye password_hash, porque el login lo necesita
Usuario.buscarPorEmail = async (email) => {
  const [filas] = await pool.query(
    'SELECT * FROM usuario WHERE email = ?',
    [email]
  );
  return filas[0]; // undefined si no existe
};

// Inserta un usuario nuevo y devuelve el id generado
Usuario.crear = async ({ nombre, apellido, email, password_hash }) => {
  const [resultado] = await pool.query(
    'INSERT INTO usuario (nombre, apellido, email, password_hash) VALUES (?, ?, ?, ?)',
    [nombre, apellido, email, password_hash]
  );
  return resultado.insertId;
};

// Activa o desactiva un usuario; devuelve cuántas filas cambiaron
Usuario.cambiarEstado = async (id, estado) => {
  const [resultado] = await pool.query(
    'UPDATE usuario SET estado = ? WHERE id_usuario = ?',
    [estado, id]
  );
  return resultado.affectedRows;
};

module.exports = Usuario;