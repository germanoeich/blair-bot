import Canvas from 'canvas'

export function getImage () {
  var canvas = new Canvas(200, 200)
  var ctx = canvas.getContext('2d')

  ctx.font = '30px Impact'
  ctx.rotate(0.1)
  ctx.fillText('Awesome!', 50, 100)

  var te = ctx.measureText('Awesome!')
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'
  ctx.beginPath()
  ctx.lineTo(50, 102)
  ctx.lineTo(50 + te.width, 102)
  ctx.stroke()

  console.log('<img src="' + canvas.toDataURL() + '" />')
}
