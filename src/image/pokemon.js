import Canvas, { Image } from 'canvas'
import fetch from 'node-fetch'

async function loadImage (url) {
  const response = await fetch(url)
  const data = await response.buffer()
  const img = new Image()
  img.src = data
  return img
}

const padding = 25
const maxwidth = 240
const maxheight = 220

export async function renderImage (pokeinfo) {
  const canvas = new Canvas(maxwidth, maxheight)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = 'lightgray'
  ctx.fillRect(0, 0, maxwidth, maxheight)

  await drawPokemonBlock(pokeinfo, ctx)

  return canvas.toBuffer()
}

async function drawPokemonBlock (pokeinfo, ctx) {
  // those apply to both back and front sprites
  const imgW = 96
  const imgH = 96

  const frontSprite = pokeinfo.sprites.front_default
  const backSprite = pokeinfo.sprites.back_default

  const frontSpriteImg = await loadImage(frontSprite)
  const backSpriteImg = await loadImage(backSprite)

  ctx.fillStyle = 'white'
  ctx.fillRect(padding, padding, imgW * 2, imgH + 25)

  ctx.fillStyle = 'black'
  ctx.font = '22px Impact'
  ctx.fillText(pokeinfo.name, 30, 44)

  ctx.strokeStyle = 'green'

  const rectFrontX = 25
  const rectFrontY = 50
  ctx.strokeRect(rectFrontX, rectFrontY, imgW, imgH)
  ctx.drawImage(frontSpriteImg, rectFrontX, rectFrontY, imgW, imgH)

  var rectBackX = 25 + imgW
  var rectBackY = 50
  ctx.strokeRect(rectBackX, rectBackY, imgW, imgH)
  ctx.drawImage(backSpriteImg, rectBackX, rectBackY, imgW, imgH)
}
