const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()
const PUERTO = 3000

app.use(cors({ origin: ['http://localhost:5500', 'http://127.0.0.1:5500', /\.github\.io$/] }))
app.use(express.json())

app.post('/api/guardar-record', async (req, res) => {
  const { nombre_jugador, puntaje_total, tiempo_segundos, nivel_alcanzado } = req.body

  const nombre = String(nombre_jugador || '').trim()
  const puntaje = parseInt(puntaje_total)
  const tiempo = parseInt(tiempo_segundos)
  const nivel = parseInt(nivel_alcanzado)

  if (!nombre || nombre.length > 50 || isNaN(puntaje) || puntaje < 0 || isNaN(tiempo) || isNaN(nivel)) {
    return res.status(400).json({ exito: false, error: 'Datos inválidos' })
  }

  try {
    const [resultado] = await pool.execute(
      'INSERT INTO tabla_records (nombre_jugador, puntaje_total, tiempo_segundos, nivel_alcanzado) VALUES (?, ?, ?, ?)',
      [nombre, puntaje, tiempo, nivel]
    )
    res.json({ exito: true, id: resultado.insertId })
  } catch (error) {
    res.status(500).json({ exito: false, error: 'Error al guardar en base de datos' })
  }
})

app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en puerto ${PUERTO}`)
})
