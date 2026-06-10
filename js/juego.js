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

  const input = document.createElement('input')
  input.type = 'text'
  input.id = 'nombreInput'
  input.placeholder = 'Tu nombre'
  input.maxLength = 50
  input.value = estado.nombreJugador || ''

  const boton = document.createElement('button')
  boton.id = 'btnIniciar'
  boton.textContent = 'Iniciar'

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
  }
}

function dibujarInicio() {
  const gradFondo = ctx.createLinearGradient(0, 0, 0, 600)
  gradFondo.addColorStop(0, '#0d0500')
  gradFondo.addColorStop(0.5, '#1a0a00')
  gradFondo.addColorStop(1, '#2a1500')
  ctx.fillStyle = gradFondo
  ctx.fillRect(0, 0, 800, 600)

  ctx.fillStyle = '#3d2005'
  ctx.fillRect(360, 340, 30, 100)

  ctx.fillStyle = '#2d5a1a'
  ctx.beginPath()
  ctx.arc(375, 310, 80, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#3d7a22'
  ctx.beginPath()
  ctx.arc(345, 285, 55, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#356b1f'
  ctx.beginPath()
  ctx.arc(408, 290, 60, 0, Math.PI * 2)
  ctx.fill()

  ctx.shadowColor = '#c8a000'
  ctx.shadowBlur = 20
  ctx.fillStyle = '#f5d060'
  ctx.font = 'bold 42px Georgia'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('Apicultura en el', 400, 90)
  ctx.fillText('Bosque Seco', 400, 140)
  ctx.shadowBlur = 0

  ctx.fillStyle = '#c8a000'
  ctx.font = '20px Georgia'
  ctx.fillText('¡Calma los panales y extraé la miel!', 400, 195)

  ctx.fillStyle = '#aa8800'
  ctx.font = '16px Georgia'
  ctx.fillText('Nivel 1: Usá el humo para calmar los panales', 400, 235)
  ctx.fillText('Nivel 2: Controlá la centrífuga con A / D', 400, 260)

  ctx.fillStyle = '#f5d060'
  ctx.font = '18px Georgia'
  ctx.fillText('Ingresá tu nombre para comenzar:', 400, 420)
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
