require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const pool = require('./database');

const app = express();

// Middlewares
app.use(morgan('dev'));   // muestra cada petición en la consola
app.use(express.json());  // convierte el cuerpo JSON en req.body
app.use(cors({ origin: 'http://localhost:5173' })); // permite el frontend React (Vite)

// Ruta de prueba: confirma que la API y la base de datos responden
app.get('/api/salud', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'API y base de datos funcionando' });
  } catch (error) {
    res.status(500).json({ status: 'Error de conexión', detalle: error.message });
  }
});

// Rutas del módulo de usuarios
app.use('/api/usuarios', require('./routes/usuario.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en el puerto ${PORT}`));