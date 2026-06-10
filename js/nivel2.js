let centrifuga = {
  rpm: 0,
  rpmMinimo: 600,
  rpmOptimo: 750,
  rpmMaximo: 1000,
  extraccion: 0,
  tiempoRestante: 90
}

let teclas = { izquierda: false, derecha: false }
let acumuladorTiempoN2 = 0
let anguloCentrifuga = 0

function inicializarNivel2() {
  centrifuga = {
    rpm: 0,
    rpmMinimo: 600,
    rpmOptimo: 750,
    rpmMaximo: 1000,
    extraccion: 0,
    tiempoRestante: 90
  }
  teclas = { izquierda: false, derecha: false }
  acumuladorTiempoN2 = 0
  anguloCentrifuga = 0
}

function actualizarNivel2(delta) {
  acumuladorTiempoN2 += delta
  if (acumuladorTiempoN2 >= 1000) {
    centrifuga.tiempoRestante--
    acumuladorTiempoN2 -= 1000
  }

  if (teclas.derecha) {
    centrifuga.rpm = Math.min(centrifuga.rpm + 10, 1200)
  }
  if (teclas.izquierda) {
    centrifuga.rpm = Math.max(centrifuga.rpm - 20, 0)
  }
  if (!teclas.izquierda && !teclas.derecha) {
    centrifuga.rpm = Math.max(centrifuga.rpm - 1, 0)
  }

  anguloCentrifuga += (centrifuga.rpm / 60) * (delta / 1000) * Math.PI * 2

  if (centrifuga.rpm >= centrifuga.rpmMinimo && centrifuga.rpm <= centrifuga.rpmMaximo) {
    const factor = centrifuga.rpm / centrifuga.rpmOptimo
    centrifuga.extraccion += 3 * (delta / 1000) * factor
  }

  if (centrifuga.rpm > centrifuga.rpmMaximo) {
    estado.puntaje -= Math.floor(delta / 100) * 10
  }

  centrifuga.extraccion = Math.min(centrifuga.extraccion, 100)

  if (centrifuga.extraccion >= 100) {
    estado.nivelAlcanzado = 2
    estado.puntaje += 200
    finalizarJuego()
    return
  }

  if (centrifuga.tiempoRestante <= 0) {
    finalizarJuego()
    return
  }
}

function dibujarNivel2() {
  const ctx = lienzo.getContext('2d')

  const gradFondo = ctx.createLinearGradient(0, 0, 800, 600)
  gradFondo.addColorStop(0, '#0d0d1a')
  gradFondo.addColorStop(0.5, '#1a1005')
  gradFondo.addColorStop(1, '#0a0a0d')
  ctx.fillStyle = gradFondo
  ctx.fillRect(0, 0, 800, 600)

  for (let i = 0; i < 30; i++) {
    const px = (i * 127 + 50) % 800
    const py = (i * 89 + 30) % 600
    ctx.fillStyle = `rgba(180, 140, 40, ${0.03 + (i % 5) * 0.01})`
    ctx.beginPath()
    ctx.arc(px, py, 2, 0, Math.PI * 2)
    ctx.fill()
  }

  const cx = 280
  const cy = 310
  const radioExterno = 150
  const radioInterno = 130

  ctx.shadowColor = 'rgba(200, 160, 0, 0.3)'
  ctx.shadowBlur = 20

  const gradCentrifuga = ctx.createRadialGradient(cx, cy, 30, cx, cy, radioExterno)
  gradCentrifuga.addColorStop(0, '#5a4a2a')
  gradCentrifuga.addColorStop(0.6, '#3a2d15')
  gradCentrifuga.addColorStop(1, '#1a1508')
  ctx.fillStyle = gradCentrifuga
  ctx.beginPath()
  ctx.arc(cx, cy, radioExterno, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#c8a000'
  ctx.lineWidth = 4
  ctx.stroke()

  ctx.shadowBlur = 0

  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(anguloCentrifuga)

  for (let i = 0; i < 4; i++) {
    const angulo = (Math.PI / 2) * i
    ctx.fillStyle = '#8a7030'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(
      Math.cos(angulo) * radioInterno,
      Math.sin(angulo) * radioInterno
    )
    ctx.lineTo(
      Math.cos(angulo + 0.15) * radioInterno,
      Math.sin(angulo + 0.15) * radioInterno
    )
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = '#c8a000'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(Math.cos(angulo) * radioInterno, Math.sin(angulo) * radioInterno)
    ctx.stroke()

    ctx.fillStyle = 'rgba(200, 160, 0, 0.6)'
    ctx.beginPath()
    ctx.roundRect(
      Math.cos(angulo) * 70 - 15,
      Math.sin(angulo) * 70 - 25,
      30,
      50,
      4
    )
    ctx.fill()
  }

  ctx.restore()

  ctx.fillStyle = '#c8a000'
  ctx.beginPath()
  ctx.arc(cx, cy, 12, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#f5d060'
  ctx.lineWidth = 2
  ctx.stroke()

  const velCX = 580
  const velCY = 310
  const velRadio = 130
  const anguloInicio = Math.PI * 0.75
  const anguloFin = Math.PI * 2.25
  const rangoAngulo = anguloFin - anguloInicio

  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.beginPath()
  ctx.arc(velCX, velCY, velRadio + 10, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#444'
  ctx.lineWidth = 2
  ctx.stroke()

  const anguloZonaOptimaIni = anguloInicio + rangoAngulo * (centrifuga.rpmMinimo / 1200)
  const anguloZonaOptimaFin = anguloInicio + rangoAngulo * (centrifuga.rpmMaximo / 1200)
  const anguloZonaPeligroFin = anguloFin

  ctx.beginPath()
  ctx.arc(velCX, velCY, velRadio, anguloInicio, anguloZonaOptimaIni)
  ctx.strokeStyle = '#555555'
  ctx.lineWidth = 16
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(velCX, velCY, velRadio, anguloZonaOptimaIni, anguloZonaOptimaFin)
  ctx.strokeStyle = '#22aa44'
  ctx.lineWidth = 16
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(velCX, velCY, velRadio, anguloZonaOptimaFin, anguloZonaPeligroFin)
  ctx.strokeStyle = '#cc2222'
  ctx.lineWidth = 16
  ctx.stroke()

  for (let i = 0; i <= 12; i++) {
    const ang = anguloInicio + rangoAngulo * (i / 12)
    const rpmMarca = Math.round(i * 100)
    const x1 = velCX + Math.cos(ang) * (velRadio - 18)
    const y1 = velCY + Math.sin(ang) * (velRadio - 18)
    const x2 = velCX + Math.cos(ang) * (velRadio + 5)
    const y2 = velCY + Math.sin(ang) * (velRadio + 5)
    ctx.strokeStyle = '#888'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    if (i % 3 === 0) {
      const xt = velCX + Math.cos(ang) * (velRadio - 35)
      const yt = velCY + Math.sin(ang) * (velRadio - 35)
      ctx.fillStyle = '#aaa'
      ctx.font = '11px Georgia'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(rpmMarca, xt, yt)
    }
  }

  const rpmNormalizado = Math.min(centrifuga.rpm, 1200) / 1200
  const anguloAguja = anguloInicio + rangoAngulo * rpmNormalizado

  ctx.save()
  ctx.translate(velCX, velCY)
  ctx.rotate(anguloAguja)
  ctx.strokeStyle = '#ff4444'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.shadowColor = '#ff0000'
  ctx.shadowBlur = 5
  ctx.beginPath()
  ctx.moveTo(-15, 0)
  ctx.lineTo(velRadio - 25, 0)
  ctx.stroke()
  ctx.shadowBlur = 0
  ctx.restore()

  ctx.fillStyle = '#c8a000'
  ctx.beginPath()
  ctx.arc(velCX, velCY, 8, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#f5d060'
  ctx.font = 'bold 18px Georgia'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(`${Math.round(centrifuga.rpm)} RPM`, velCX, velCY + 55)

  const barraX = 730
  const barraY = 120
  const barraAncho = 30
  const barraAlto = 360

  ctx.fillStyle = 'rgba(0,0,0,0.7)'
  ctx.fillRect(barraX - 5, barraY - 5, barraAncho + 10, barraAlto + 10)
  ctx.strokeStyle = '#c8a000'
  ctx.lineWidth = 2
  ctx.strokeRect(barraX - 5, barraY - 5, barraAncho + 10, barraAlto + 10)

  ctx.fillStyle = '#222'
  ctx.fillRect(barraX, barraY, barraAncho, barraAlto)

  const alturaLlena = barraAlto * (centrifuga.extraccion / 100)
  const gradMiel = ctx.createLinearGradient(0, barraY + barraAlto - alturaLlena, 0, barraY + barraAlto)
  gradMiel.addColorStop(0, '#f0c030')
  gradMiel.addColorStop(1, '#c8a000')
  ctx.fillStyle = gradMiel
  ctx.fillRect(barraX, barraY + barraAlto - alturaLlena, barraAncho, alturaLlena)

  for (let m = 0; m <= 10; m++) {
    const my = barraY + barraAlto - barraAlto * (m / 10)
    ctx.strokeStyle = '#555'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(barraX, my)
    ctx.lineTo(barraX + barraAncho, my)
    ctx.stroke()
    if (m % 5 === 0) {
      ctx.fillStyle = '#aaa'
      ctx.font = '11px Georgia'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillText(`${m * 10}%`, barraX - 8, my)
    }
  }

  ctx.fillStyle = '#f5d060'
  ctx.font = 'bold 13px Georgia'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('MIEL', barraX + barraAncho / 2, barraY - 12)

  ctx.fillStyle = 'rgba(0,0,0,0.65)'
  ctx.fillRect(0, 0, 800, 50)

  ctx.fillStyle = '#f5d060'
  ctx.font = 'bold 20px Georgia'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(`Puntaje: ${estado.puntaje}`, 20, 32)

  ctx.textAlign = 'center'
  const colorTiempoN2 = centrifuga.tiempoRestante <= 15 ? '#ff4444' : '#f5d060'
  ctx.fillStyle = colorTiempoN2
  ctx.fillText(`Tiempo: ${centrifuga.tiempoRestante}s`, 400, 32)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#c8a000'
  ctx.font = '14px Georgia'
  ctx.fillText('Nivel 2 — Controlá la centrífuga con A / D', 400, 580)

  ctx.fillStyle = '#888'
  ctx.font = '13px Georgia'
  ctx.textAlign = 'left'
  ctx.fillText('A ← desacelerar', 20, 565)
  ctx.textAlign = 'right'
  ctx.fillText('acelerar → D', 780, 565)

  if (centrifuga.rpm > centrifuga.rpmMaximo) {
    ctx.fillStyle = 'rgba(200, 0, 0, 0.15)'
    ctx.fillRect(0, 0, 800, 600)
    ctx.fillStyle = '#ff4444'
    ctx.font = 'bold 16px Georgia'
    ctx.textAlign = 'center'
    ctx.fillText('¡VELOCIDAD PELIGROSA! Perdés puntos', 400, 560)
  }
}
