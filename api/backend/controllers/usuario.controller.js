const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');

const usuarioCtrl = {};

// Validación sencilla de formato de correo
const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// GET /api/usuarios -> lista los usuarios registrados
usuarioCtrl.listar = async (req, res) => {
  try {
    const usuarios = await Usuario.listar();
    res.json(usuarios);
  } catch (error) {
    console.error('Error en listar:', error);
    res.status(500).json({ error: 'No se pudieron obtener los usuarios' });
  }
};

// POST /api/usuarios -> registra un usuario nuevo
usuarioCtrl.registrar = async (req, res) => {
  try {
    const { nombre, apellido, password } = req.body;
    const email = (req.body.email || '').trim().toLowerCase();

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    if (!emailValido(email)) {
      return res.status(400).json({ error: 'El email no es válido' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres' });
    }

    // Se cifra la contraseña antes de guardarla
    const password_hash = await bcrypt.hash(password, 10);
    const id = await Usuario.crear({ nombre, apellido, email, password_hash });

    res.status(201).json({ status: 'Usuario registrado', id_usuario: id });
  } catch (error) {
    console.error('Error en registrar:', error);
    // email tiene restricción UNIQUE en la tabla
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: 'No se pudo registrar el usuario' });
  }
};

// POST /api/usuarios/login -> valida credenciales
usuarioCtrl.login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = (req.body.email || '').trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const usuario = await Usuario.buscarPorEmail(email);

    // Mismo mensaje si el email no existe o la contraseña falla
    const credencialesValidas =
      usuario && (await bcrypt.compare(password, usuario.password_hash));
    if (!credencialesValidas) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Un usuario desactivado no puede entrar
    if (!usuario.estado) {
      return res.status(403).json({ error: 'El usuario está inactivo' });
    }

    // Se responde sin password_hash
    res.json({
      status: 'Inicio de sesión exitoso',
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'No se pudo iniciar sesión' });
  }
};

// PATCH /api/usuarios/:id/estado -> activa o desactiva un usuario
usuarioCtrl.cambiarEstado = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { estado } = req.body;

    if (!Number.isInteger(id) || typeof estado !== 'boolean') {
      return res.status(400).json({ error: 'Se requiere un id válido y estado true o false' });
    }

    const filas = await Usuario.cambiarEstado(id, estado);
    if (filas === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ status: 'Estado actualizado' });
  } catch (error) {
    console.error('Error en cambiarEstado:', error);
    res.status(500).json({ error: 'No se pudo actualizar el estado' });
  }
};

module.exports = usuarioCtrl;