let panales = []
let rafagasRestantes = 20
let tiempoRestanteN1 = 60
let acumuladorTiempoN1 = 0
let efectosHumo = []
let tiempoAbeja = 0

function inicializarNivel1() {
  panales = [
    { x: 150, y: 150, ancho: 120, alto: 80, agresividad: 100 },
    { x: 530, y: 150, ancho: 120, alto: 80, agresividad: 100 },
    { x: 150, y: 380, ancho: 120, alto: 80, agresividad: 100 },
    { x: 530, y: 380, ancho: 120, alto: 80, agresividad: 100 }
  ]
  rafagasRestantes = 20
  tiempoRestanteN1 = 60
  acumuladorTiempoN1 = 0
  efectosHumo = []
  tiempoAbeja = 0
}

function actualizarNivel1(delta) {
  acumuladorTiempoN1 += delta
  if (acumuladorTiempoN1 >= 1000) {
    tiempoRestanteN1--
    acumuladorTiempoN1 -= 1000
  }

  estado.puntaje -= Math.floor(delta / 1000)

  tiempoAbeja += delta

  for (let i = efectosHumo.length - 1; i >= 0; i--) {
    const humo = efectosHumo[i]
    humo.radio += 0.4
    humo.opacidad -= 0.015
    if (humo.opacidad <= 0) {
      efectosHumo.splice(i, 1)
    }
  }

  if (tiempoRestanteN1 <= 0) {
    estado.nivelAlcanzado = 1
    finalizarJuego()
    return
  }

  const todosCalmos = panales.every(p => p.agresividad === 0)
  if (todosCalmos) {
    inicializarNivel2()
    estado.pantalla = 'nivel2'
  }
}

function dibujarNivel1() {
  const ctx = lienzo.getContext('2d')

  const gradFondo = ctx.createLinearGradient(0, 0, 0, 600)
  gradFondo.addColorStop(0, '#1a0a00')
  gradFondo.addColorStop(0.5, '#2d1a05')
  gradFondo.addColorStop(1, '#3d2510')
  ctx.fillStyle = gradFondo
  ctx.fillRect(0, 0, 800, 600)

  ctx.fillStyle = '#3d2005'
  ctx.fillRect(380, 400, 40, 120)

  ctx.fillStyle = '#2d5a1a'
  ctx.beginPath()
  ctx.arc(400, 360, 100, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#356b1f'
  ctx.beginPath()
  ctx.arc(360, 330, 70, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#3d7a22'
  ctx.beginPath()
  ctx.arc(440, 340, 75, 0, Math.PI * 2)
  ctx.fill()

  for (const panal of panales) {
    const gradPanal = ctx.createLinearGradient(panal.x, panal.y, panal.x + panal.ancho, panal.y + panal.alto)
    gradPanal.addColorStop(0, '#c8a000')
    gradPanal.addColorStop(0.5, '#f0c030')
    gradPanal.addColorStop(1, '#a07800')
    ctx.fillStyle = gradPanal
    ctx.beginPath()
    ctx.roundRect(panal.x, panal.y, panal.ancho, panal.alto, 8)
    ctx.fill()

    ctx.strokeStyle = '#7a5500'
    ctx.lineWidth = 2
    ctx.stroke()

    const hexSize = 12
    ctx.strokeStyle = 'rgba(100, 70, 0, 0.4)'
    ctx.lineWidth = 1
    for (let col = 0; col < 5; col++) {
      for (let fila = 0; fila < 3; fila++) {
        const hx = panal.x + 15 + col * hexSize * 1.7
        const hy = panal.y + 15 + fila * hexSize * 1.5 + (col % 2) * hexSize * 0.75
        if (hx + hexSize < panal.x + panal.ancho - 5 && hy + hexSize < panal.y + panal.alto - 5) {
          dibujarHexagono(ctx, hx, hy, hexSize * 0.6)
        }
      }
    }

    const barraY = panal.y + panal.alto + 8
    ctx.fillStyle = '#330000'
    ctx.fillRect(panal.x, barraY, panal.ancho, 10)

    const porcentaje = panal.agresividad / 100
    const r = Math.floor(255 * porcentaje)
    const g = Math.floor(200 * (1 - porcentaje))
    ctx.fillStyle = `rgb(${r}, ${g}, 0)`
    ctx.fillRect(panal.x, barraY, panal.ancho * porcentaje, 10)

    ctx.strokeStyle = '#555'
    ctx.lineWidth = 1
    ctx.strokeRect(panal.x, barraY, panal.ancho, 10)

    const numAbejas = Math.floor(panal.agresividad / 20)
    const t = tiempoAbeja / 300
    for (let i = 0; i < numAbejas; i++) {
      const angulo = (t * 2 + i * (Math.PI * 2 / numAbejas))
      const radio = 35 + Math.sin(t * 3 + i) * 8
      const ax = panal.x + panal.ancho / 2 + Math.cos(angulo) * radio
      const ay = panal.y + panal.alto / 2 + Math.sin(angulo) * radio * 0.5
      ctx.fillStyle = '#1a1a00'
      ctx.beginPath()
      ctx.ellipse(ax, ay, 4, 3, angulo, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(220, 220, 255, 0.7)'
      ctx.beginPath()
      ctx.ellipse(ax - 2, ay - 2, 3, 2, angulo + 0.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  for (const humo of efectosHumo) {
    ctx.beginPath()
    ctx.arc(humo.x, humo.y, humo.radio, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(220, 220, 200, ${humo.opacidad})`
    ctx.fill()

    ctx.beginPath()
    ctx.arc(humo.x + humo.radio * 0.4, humo.y - humo.radio * 0.3, humo.radio * 0.7, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(200, 200, 180, ${humo.opacidad * 0.7})`
    ctx.fill()
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
  ctx.fillRect(0, 0, 800, 50)

  ctx.fillStyle = '#f5d060'
  ctx.font = 'bold 20px Georgia'
  ctx.textAlign = 'left'
  ctx.fillText(`Puntaje: ${estado.puntaje}`, 20, 32)

  ctx.textAlign = 'center'
  const colorTiempo = tiempoRestanteN1 <= 10 ? '#ff4444' : '#f5d060'
  ctx.fillStyle = colorTiempo
  ctx.fillText(`Tiempo: ${tiempoRestanteN1}s`, 400, 32)

  ctx.textAlign = 'right'
  ctx.fillStyle = rafagasRestantes <= 5 ? '#ff8844' : '#f5d060'
  ctx.fillText(`Ráfagas: ${rafagasRestantes}`, 780, 32)

  ctx.fillStyle = '#c8a000'
  ctx.font = '14px Georgia'
  ctx.textAlign = 'center'
  ctx.fillText('Nivel 1 — Calmá los panales con humo', 400, 580)
}

function dibujarHexagono(ctx, x, y, radio) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angulo = (Math.PI / 3) * i - Math.PI / 6
    const px = x + radio * Math.cos(angulo)
    const py = y + radio * Math.sin(angulo)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.stroke()
}

function disparar(mouseX, mouseY) {
  if (rafagasRestantes <= 0) return

  let panalMasCercano = null
  let distanciaMinima = Infinity

  for (const panal of panales) {
    if (panal.agresividad === 0) continue
    const cx = panal.x + panal.ancho / 2
    const cy = panal.y + panal.alto / 2
    const dist = Math.sqrt((mouseX - cx) ** 2 + (mouseY - cy) ** 2)
    if (dist < distanciaMinima) {
      distanciaMinima = dist
      panalMasCercano = panal
    }
  }

  if (!panalMasCercano) return

  const agresividadAntes = panalMasCercano.agresividad
  panalMasCercano.agresividad = Math.max(0, panalMasCercano.agresividad - 25)

  if (agresividadAntes > 0 && panalMasCercano.agresividad === 0) {
    estado.puntaje += 10
  }

  rafagasRestantes--

  efectosHumo.push({ x: mouseX, y: mouseY, radio: 5, opacidad: 0.8 })
}
