const lienzo = document.getElementById('lienzo')
const ctx = lienzo.getContext('2d')

let estado = {
  pantalla: 'inicio',
  nombreJugador: '',
  puntaje: 1000,
  tiempoInicio: 0,
  tiempoTotal: 0,
  nivelAlcanzado: 1,
  recordGuardado: false,
  mensajeRecord: ''
}

let ultimaMarca = 0
let divSuperpuesto = null

function crearDivSuperpuesto() {
  if (divSuperpuesto) return

  const rect = lienzo.getBoundingClientRect()
  divSuperpuesto = document.createElement('div')
  divSuperpuesto.id = 'superpuesto'
  divSuperpuesto.style.top = rect.top + window.scrollY + 'px'
  divSuperpuesto.style.left = rect.left + window.scrollX + 'px'
  divSuperpuesto.style.width = rect.width + 'px'
  divSuperpuesto.style.height = rect.height + 'px'
  document.body.appendChild(divSuperpuesto)
}

function removerDivSuperpuesto() {
  if (divSuperpuesto) {
    divSuperpuesto.remove()
    divSuperpuesto = null
  }
}

function mostrarFormularioInicio() {
  crearDivSuperpuesto()
  divSuperpuesto.innerHTML = ''

  const etiqueta = document.createElement('p')
  etiqueta.textContent = 'Ingresá tu nombre para comenzar:'
  etiqueta.style.cssText = 'margin:0 0 8px 0;color:#f5d060;font:17px Georgia,serif;text-align:center;'

  const input = document.createElement('input')
  input.type = 'text'
  input.id = 'nombreInput'
  input.placeholder = 'Tu nombre'
  input.maxLength = 50
  input.value = estado.nombreJugador || ''

  const boton = document.createElement('button')
  boton.id = 'btnIniciar'
  boton.textContent = 'Iniciar'

  divSuperpuesto.appendChild(etiqueta)
  divSuperpuesto.appendChild(input)
  divSuperpuesto.appendChild(boton)

  const rect = lienzo.getBoundingClientRect()
  divSuperpuesto.style.top = (rect.top + window.scrollY + rect.height / 2 + 30) + 'px'
  divSuperpuesto.style.left = (rect.left + window.scrollX + rect.width / 2 - 120) + 'px'
  divSuperpuesto.style.width = 'auto'
  divSuperpuesto.style.height = 'auto'

  boton.addEventListener('click', function () {
    const nombre = input.value.trim()
    if (nombre.length === 0) {
      input.style.borderColor = '#ff4444'
      input.focus()
      return
    }
    if (nombre === 'AdministradorUNP435*') {
      removerDivSuperpuesto()
      estado.pantalla = 'admin'
      mostrarPanelAdmin()
      return
    }
    estado.nombreJugador = nombre
    removerDivSuperpuesto()
    iniciarJuego()
  })

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') boton.click()
  })

  setTimeout(() => input.focus(), 50)
}

function mostrarBotonReiniciar() {
  crearDivSuperpuesto()
  divSuperpuesto.innerHTML = ''

  const boton = document.createElement('button')
  boton.id = 'btnReiniciar'
  boton.textContent = 'Jugar de nuevo'

  divSuperpuesto.appendChild(boton)

  const rect = lienzo.getBoundingClientRect()
  divSuperpuesto.style.top = (rect.top + window.scrollY + rect.height / 2 + 90) + 'px'
  divSuperpuesto.style.left = (rect.left + window.scrollX + rect.width / 2 - 80) + 'px'
  divSuperpuesto.style.width = 'auto'
  divSuperpuesto.style.height = 'auto'

  boton.addEventListener('click', function () {
    removerDivSuperpuesto()
    reiniciarJuego()
  })
}

function reiniciarJuego() {
  estado = {
    pantalla: 'inicio',
    nombreJugador: '',
    puntaje: 1000,
    tiempoInicio: 0,
    tiempoTotal: 0,
    nivelAlcanzado: 1,
    recordGuardado: false,
    mensajeRecord: ''
  }
  ultimaMarca = 0
  dibujar()
  mostrarFormularioInicio()
}

function iniciarJuego() {
  estado.puntaje = 1000
  estado.nivelAlcanzado = 1
  estado.recordGuardado = false
  estado.mensajeRecord = ''
  estado.tiempoInicio = Date.now()
  estado.tiempoTotal = 0
  estado.pantalla = 'nivel1'
  ultimaMarca = 0
  inicializarNivel1()
  requestAnimationFrame(bucle)
}

function bucle(marcaDeTiempo) {
  if (estado.pantalla !== 'nivel1' && estado.pantalla !== 'nivel2') return

  const deltaTiempo = ultimaMarca === 0 ? 16 : marcaDeTiempo - ultimaMarca
  ultimaMarca = marcaDeTiempo

  actualizar(deltaTiempo)
  dibujar()

  if (estado.pantalla === 'nivel1' || estado.pantalla === 'nivel2') {
    requestAnimationFrame(bucle)
  }
}

function actualizar(delta) {
  switch (estado.pantalla) {
    case 'nivel1':
      actualizarNivel1(delta)
      break
    case 'nivel2':
      actualizarNivel2(delta)
      break
  }
}

function dibujar() {
  switch (estado.pantalla) {
    case 'inicio':
      dibujarInicio()
      break
    case 'nivel1':
      dibujarNivel1()
      break
    case 'nivel2':
      dibujarNivel2()
      break
    case 'gameover':
      dibujarGameOver()
      break
    case 'admin':
      dibujarAdmin()
      break
  }
}

function dibujarAdmin() {
  const gradFondo = ctx.createLinearGradient(0, 0, 0, 600)
  gradFondo.addColorStop(0, '#0d0500')
  gradFondo.addColorStop(1, '#1a0a00')
  ctx.fillStyle = gradFondo
  ctx.fillRect(0, 0, 800, 600)

  ctx.fillStyle = '#c8a000'
  ctx.font = 'bold 22px Georgia'
  ctx.textAlign = 'center'
  ctx.fillText('Panel de Administración — Records', 400, 45)
}

async function mostrarPanelAdmin() {
  const resultado = await obtenerRecords()

  crearDivSuperpuesto()
  divSuperpuesto.innerHTML = ''
  divSuperpuesto.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    max-height: 480px;
    background: rgba(15, 6, 0, 0.97);
    border: 2px solid #c8a000;
    border-radius: 10px;
    padding: 20px 24px;
    overflow-y: auto;
    font-family: Georgia, serif;
    color: #f5d060;
    box-sizing: border-box;
  `

  const titulo = document.createElement('h2')
  titulo.textContent = 'Records almacenados'
  titulo.style.cssText = 'margin:0 0 16px;text-align:center;color:#f5d060;font-size:20px;'
  divSuperpuesto.appendChild(titulo)

  if (!resultado.exito) {
    const error = document.createElement('p')
    error.textContent = `Error: ${resultado.error}`
    error.style.cssText = 'color:#ff6644;text-align:center;'
    divSuperpuesto.appendChild(error)
  } else if (resultado.records.length === 0) {
    const vacio = document.createElement('p')
    vacio.textContent = 'No hay records guardados aún.'
    vacio.style.cssText = 'text-align:center;color:#aa8800;'
    divSuperpuesto.appendChild(vacio)
  } else {
    const tabla = document.createElement('table')
    tabla.style.cssText = 'width:100%;border-collapse:collapse;font-size:14px;'

    const encabezados = ['#', 'Jugador', 'Puntaje', 'Tiempo (s)', 'Nivel', 'Fecha']
    const thead = document.createElement('thead')
    const trHead = document.createElement('tr')
    for (const enc of encabezados) {
      const th = document.createElement('th')
      th.textContent = enc
      th.style.cssText = 'padding:8px 10px;border-bottom:1px solid #c8a000;color:#c8a000;text-align:left;'
      trHead.appendChild(th)
    }
    thead.appendChild(trHead)
    tabla.appendChild(thead)

    const tbody = document.createElement('tbody')
    resultado.records.forEach((rec, idx) => {
      const tr = document.createElement('tr')
      tr.style.background = idx % 2 === 0 ? 'rgba(200,160,0,0.06)' : 'transparent'
      const fecha = new Date(rec.fecha_registro).toLocaleString('es-PE')
      const celdas = [idx + 1, rec.nombre_jugador, rec.puntaje_total, rec.tiempo_segundos, rec.nivel_alcanzado, fecha]
      for (const val of celdas) {
        const td = document.createElement('td')
        td.textContent = val
        td.style.cssText = 'padding:7px 10px;border-bottom:1px solid rgba(200,160,0,0.2);'
        tr.appendChild(td)
      }
      tbody.appendChild(tr)
    })
    tabla.appendChild(tbody)
    divSuperpuesto.appendChild(tabla)
  }

  const botonVolver = document.createElement('button')
  botonVolver.textContent = 'Volver al inicio'
  botonVolver.style.cssText = 'margin-top:16px;display:block;width:100%;'
  botonVolver.addEventListener('click', function () {
    removerDivSuperpuesto()
    estado.pantalla = 'inicio'
    mostrarFormularioInicio()
  })
  divSuperpuesto.appendChild(botonVolver)
}

function dibujarArbolAlgarrobo(cx, baseY, escala) {
  ctx.fillStyle = '#3d2005'
  ctx.fillRect(cx - 10 * escala, baseY - 80 * escala, 20 * escala, 80 * escala)
  ctx.fillStyle = '#2d5a1a'
  ctx.beginPath()
  ctx.arc(cx, baseY - 100 * escala, 55 * escala, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#3d7a22'
  ctx.beginPath()
  ctx.arc(cx - 30 * escala, baseY - 120 * escala, 38 * escala, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#356b1f'
  ctx.beginPath()
  ctx.arc(cx + 32 * escala, baseY - 115 * escala, 40 * escala, 0, Math.PI * 2)
  ctx.fill()
}

function dibujarInicio() {
  const gradFondo = ctx.createLinearGradient(0, 0, 0, 600)
  gradFondo.addColorStop(0, '#0d0500')
  gradFondo.addColorStop(0.5, '#1a0a00')
  gradFondo.addColorStop(1, '#2a1500')
  ctx.fillStyle = gradFondo
  ctx.fillRect(0, 0, 800, 600)

  dibujarArbolAlgarrobo(110, 560, 0.9)
  dibujarArbolAlgarrobo(690, 560, 0.9)

  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  ctx.beginPath()
  ctx.roundRect(200, 55, 400, 300, 16)
  ctx.fill()

  ctx.shadowColor = '#c8a000'
  ctx.shadowBlur = 20
  ctx.fillStyle = '#f5d060'
  ctx.font = 'bold 42px Georgia'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('Apicultura en el', 400, 110)
  ctx.fillText('Bosque Seco', 400, 160)
  ctx.shadowBlur = 0

  ctx.fillStyle = '#c8a000'
  ctx.font = '19px Georgia'
  ctx.fillText('¡Calma los panales y extraé la miel!', 400, 210)

  ctx.fillStyle = '#aa8800'
  ctx.font = '15px Georgia'
  ctx.fillText('Nivel 1: Hacé click sobre los panales para aplicar humo', 400, 248)
  ctx.fillText('Nivel 2: Controlá la centrífuga con A / D', 400, 272)

  ctx.fillStyle = '#c8a000'
  ctx.font = '14px Georgia'
  ctx.fillText('— Emmanuel Ochoa —', 400, 310)

}

function dibujarGameOver() {
  const gradFondo = ctx.createLinearGradient(0, 0, 0, 600)
  gradFondo.addColorStop(0, '#0d0500')
  gradFondo.addColorStop(1, '#2a1500')
  ctx.fillStyle = gradFondo
  ctx.fillRect(0, 0, 800, 600)

  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fillRect(150, 80, 500, 400)
  ctx.strokeStyle = '#c8a000'
  ctx.lineWidth = 2
  ctx.strokeRect(150, 80, 500, 400)

  const titulo = estado.nivelAlcanzado === 2 ? '¡Cosecha completada!' : 'Juego terminado'
  ctx.fillStyle = estado.nivelAlcanzado === 2 ? '#f5d060' : '#ff8844'
  ctx.shadowColor = estado.nivelAlcanzado === 2 ? '#c8a000' : '#ff4400'
  ctx.shadowBlur = 15
  ctx.font = 'bold 36px Georgia'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(titulo, 400, 140)
  ctx.shadowBlur = 0

  ctx.fillStyle = '#f5d060'
  ctx.font = '22px Georgia'
  ctx.fillText(estado.nombreJugador, 400, 190)

  ctx.fillStyle = '#c8a000'
  ctx.font = 'bold 28px Georgia'
  ctx.fillText(`Puntaje final: ${estado.puntaje}`, 400, 240)

  ctx.fillStyle = '#aaa'
  ctx.font = '18px Georgia'
  ctx.fillText(`Tiempo: ${estado.tiempoTotal}s`, 400, 280)
  ctx.fillText(`Nivel alcanzado: ${estado.nivelAlcanzado}`, 400, 310)

  if (estado.mensajeRecord) {
    ctx.fillStyle = estado.recordGuardado ? '#44cc44' : '#ff8844'
    ctx.font = '16px Georgia'
    ctx.fillText(estado.mensajeRecord, 400, 355)
  } else if (estado.nivelAlcanzado === 2) {
    ctx.fillStyle = '#888'
    ctx.font = '14px Georgia'
    ctx.fillText('Guardando récord...', 400, 355)
  }
}

function finalizarJuego() {
  estado.tiempoTotal = Math.floor((Date.now() - estado.tiempoInicio) / 1000)
  estado.pantalla = 'gameover'

  removerDivSuperpuesto()
  dibujar()
  mostrarBotonReiniciar()

  if (estado.nivelAlcanzado === 2) {
    guardarRecord({
      nombre_jugador: estado.nombreJugador,
      puntaje_total: estado.puntaje,
      tiempo_segundos: estado.tiempoTotal,
      nivel_alcanzado: estado.nivelAlcanzado
    }).then(resultado => {
      estado.recordGuardado = resultado.exito
      estado.mensajeRecord = resultado.exito
        ? `¡Récord guardado! ID: ${resultado.id}`
        : `No se pudo guardar: ${resultado.error}`
      dibujar()
    })
  }
}

lienzo.addEventListener('click', function (e) {
  if (estado.pantalla === 'nivel1') {
    disparar(e.offsetX, e.offsetY)
  }
})

document.addEventListener('keydown', function (e) {
  if (estado.pantalla !== 'nivel2') return
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    teclas.izquierda = true
  }
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    teclas.derecha = true
  }
})

document.addEventListener('keyup', function (e) {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    teclas.izquierda = false
  }
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    teclas.derecha = false
  }
})

dibujarInicio()
mostrarFormularioInicio()
