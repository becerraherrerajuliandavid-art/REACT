const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuario.controller');

// Cada ruta asocia un método HTTP con una función del controlador
router.get('/', usuarioCtrl.listar);                        // GET   /api/usuarios
router.post('/', usuarioCtrl.registrar);                    // POST  /api/usuarios
router.post('/login', usuarioCtrl.login);                   // POST  /api/usuarios/login
router.patch('/:id/estado', usuarioCtrl.cambiarEstado);     // PATCH /api/usuarios/5/estado

module.exports = router;