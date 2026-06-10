async function guardarRecord(datos) {
  try {
    const respuesta = await fetch('http://localhost:3000/api/guardar-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
    const resultado = await respuesta.json()
    return resultado
  } catch (error) {
    return { exito: false, error: 'No se pudo conectar con el servidor' }
  }
}
