const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 1. GET: Obtener usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const sql = 'SELECT id, nombre, apellidos, correo FROM usuarios';
    const [filas] = await db.query(sql);
    res.json(filas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// 2. POST: Crear usuario
app.post('/api/usuarios', async (req, res) => {
  const { nombre, apellidos, correo } = req.body;
  try {
    const sql = 'INSERT INTO usuarios (nombre, apellidos, correo) VALUES (?, ?, ?)';
    const [resultado] = await db.query(sql, [nombre, apellidos, correo]);
    res.status(201).json({ id: resultado.insertId, mensaje: 'Usuario creado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar' });
  }
});

// 3. PUT: Actualizar usuario
app.put('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellidos, correo } = req.body;
  try {
    const sql = 'UPDATE usuarios SET nombre = ?, apellidos = ?, correo = ? WHERE id = ?';
    await db.query(sql, [nombre, apellidos, correo, id]);
    res.json({ mensaje: 'Usuario actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// 4. DELETE: Eliminar usuario
app.delete('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const sql = 'DELETE FROM usuarios WHERE id = ?';
    await db.query(sql, [id]);
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

if (require.main === module) {
  app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
}

module.exports = app;