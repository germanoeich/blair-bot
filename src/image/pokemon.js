import Canvas from 'canvas'
import { capitalizeName } from './../util/pokemon-names'
import { drawRects, drawTexts, loadAndDrawImages } from './../util/image'

const padding = 10
const maxwidth = 240
const maxheight = 220
// those apply to both back and front sprites
const imgW = 96
const imgH = 96

export async function renderImage (pokeinfo) {
  const canvas = new Canvas(maxwidth, maxheight)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = 'lightgray'
  ctx.fillRect(0, 0, maxwidth, maxheight)

  await drawPokemonBlock(pokeinfo, ctx)

  return canvas.toBuffer()
}

async function drawPokemonBlock (pokeinfo, ctx) {
  console.log('\x1b[32m', `Drawing "${pokeinfo.name}" block`)

  // Background
  const rects = [{
    x: padding,
    y: padding,
    width: 220,
    height: 35,
    style: 'white'
  },
  {
    x: padding,
    y: 60,
    width: 220,
    height: 96,
    style: 'white'
  }]

  const texts = [{
    text: capitalizeName(pokeinfo.name),
    style: 'black',
    font: '22px Consolas',
    x: padding + 5,
    y: 35
  }]

  const noFrontSpriteText = {
    text: '?',
    style: 'lightgray',
    font: '48px Consolas',
    x: padding + 35,
    y: 60 + 65
  }

  const noBackSpriteText = {
    text: '?',
    style: 'lightgray',
    font: '48px Consolas',
    x: imgW + padding + 35,
    y: 60 + 65
  }

  const frontSprite = pokeinfo.sprites.front_default
  const backSprite = pokeinfo.sprites.back_default

  const images = []

  if (frontSprite) {
    images.push({
      url: frontSprite,
      x: padding + 10,
      y: 60,
      width: imgW,
      height: imgH
    })
  } else {
    texts.push(noFrontSpriteText)
  }

  if (backSprite) {
    images.push({
      url: backSprite,
      x: padding + 18 + imgW,
      y: 60,
      width: imgW,
      height: imgH
    })
  } else {
    texts.push(noBackSpriteText)
  }

  drawRects(ctx, rects)
  await loadAndDrawImages(ctx, images, true)
  drawTexts(ctx, texts)
}
