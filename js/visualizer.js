/* "Visualizer" style effect */
/* Modified from Dmytro Lvivsky's work https://codepen.io/UnforbiddenYet/pen/mOmrvB */

// Colors
let mainColor = '#0F76E6'
let secondaryColor = '#008f03'

// Async load handler
if (document.readyState !== 'loading') {
  run()
} else {
  document.addEventListener('DOMContentLoaded', run)
}

function run () {
  const MAX_VELOCITY = 10
  const MAX_LINE_WIDTH = 1

  const canvas = document.getElementById('visualizer')
  const ctx = canvas.getContext('2d')

  let width, height, centerX, centerY, maxSize

  const objsNum = 250
  let objs = []

  function render () {
    ctx.clearRect(0, 0, width, height)

    for (var i = 0, l = objs.length; i < l; i++) {
      let o = objs[i]

      if (o.s > maxSize && !o.locked) {
        o.c = mainColor
        o.d = -1
        o.locked = true
      } else if (o.s < 0) {
        o.c = secondaryColor
        o.d = 1
        o.locked = false
      }

      drawHex(o)
      ctx.beginPath()
      ctx.rect(o.x + random(-o.s, o.s), o.y + random(-o.s, o.s), 5 * Math.sin(o.s * 2 * Math.PI / o.nS), 5)
      ctx.stroke()

      o.s += o.v * o.d
    }
  }

  function drawHex (o) {
    ctx.beginPath()
    ctx.moveTo(o.x + o.s * Math.cos(o.r), o.y + o.s * Math.sin(o.r))

    for (let i = 1; i <= o.nS; i += 1) {
      let angle = (i * 2 * Math.PI / o.nS) + o.r

      ctx.lineTo(o.x + o.s * Math.cos(angle), o.y + o.s * Math.sin(angle))
    }

    ctx.strokeStyle = o.c
    ctx.lineWidth = o.lW
    ctx.stroke()
  }

  function newObj (i) {
    return {
      i,
      nS: random(8, 15),
      s: random(5, 50),
      x: centerX,
      y: centerY,
      c: secondaryColor,
      r: random(0, maxSize + 1),
      v: random(0.5, MAX_VELOCITY),
      lW: random(1, MAX_LINE_WIDTH),
      d: 1
    }
  }

  function random (min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function setup () {
    width = window.innerWidth
    height = window.innerHeight

    centerX = width * 0.5
    centerY = height * 0.5

    canvas.width = width
    canvas.height = height

    maxSize = Math.max(centerX + 300, centerY + 300)

    resetObjects()
  }

  function resetObjects () {
    objs = []
    for (var i = 0; i < objsNum; i++) {
      objs.push(newObj(i))
    }
  }

  function animate () {
    window.requestAnimationFrame(animate)
    render()
  }

  setup()
  animate()

  window.addEventListener('resize', setup)
}
