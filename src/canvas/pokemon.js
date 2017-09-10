import Canvas from 'canvas'
import chalk from 'chalk'
import { capitalizeName } from './../util/pokemon-names'
import CanvasHelper from './../lib/canvas'

const padding = 10
const maxwidth = 400
const maxheight = 170
// those apply to both back and front sprites
const imgW = 96
const imgH = 96

export async function renderImage (pokeinfo) {
  const canvas = new Canvas(maxwidth, maxheight)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = 'lightgray'
  ctx.fillRect(0, 0, maxwidth, maxheight)

  await drawPokemonBlock(pokeinfo, ctx)
  drawStatsBlock(pokeinfo, ctx)

  return canvas.toBuffer()
}

async function drawPokemonBlock (pokeinfo, ctx) {
  console.log(chalk.green(`Drawing ${chalk.white.bgGreen(pokeinfo.name)} block`))

  const rects = [{
    x: padding,
    y: padding,
    width: maxwidth - (padding * 2),
    height: 35,
    style: 'white'
  },
  {
    x: padding,
    y: 60,
    width: imgW,
    height: imgH,
    style: 'white'
  }]

  const texts = [{
    text: capitalizeName(pokeinfo.name),
    style: 'black',
    font: '22px Consolas',
    x: maxwidth / 2,
    y: 30
  }]

  const noFrontSpriteText = {
    text: '?',
    style: 'lightgray',
    font: '48px Consolas',
    x: padding + (imgW / 2),
    y: 60 + (imgH / 2)
  }

  const frontSprite = pokeinfo.sprites.front_default

  const images = []

  if (frontSprite) {
    images.push({
      url: frontSprite,
      x: padding,
      y: 60,
      width: imgW,
      height: imgH
    })
  } else {
    texts.push(noFrontSpriteText)
  }

  const cvHelper = new CanvasHelper(ctx)

  cvHelper.drawRects(rects)
  await cvHelper.loadAndDrawImages(images, true)
  cvHelper.drawTexts(texts)
}

function drawStatsBlock (pokeinfo, ctx) {
  const initialY = 60
  const initialX = padding + 96 + padding

  const barHeight = 12
  const barWidth = (maxwidth - initialX - padding)
  const spaceBetweenBars = 5
  const yIncrement = (barHeight + spaceBetweenBars)

  const bars = [
    { max: 255, color1: '#FF0000', color2: '#FF5959', name: 'HP', identifier: 'hp' },
    { max: 190, color1: '#F08030', color2: '#F5AC78', name: 'Attack', identifier: 'attack' },
    { max: 230, color1: '#F8D030', color2: '#FAE078', name: 'Defense', identifier: 'defense' },
    { max: 195, color1: '#6890F0', color2: '#9DB7F5', name: 'Sp.Attack', identifier: 'special-attack' },
    { max: 230, color1: '#78C850', color2: '#A7DB8D', name: 'Sp.Defense', identifier: 'special-defense' },
    { max: 180, color1: '#F85888', color2: '#FA92B2', name: 'Speed', identifier: 'speed' }
  ]

  for (var i = 0; i < bars.length; i++) {
    const bar = bars[i]
    const barValue = pokeinfo.stats.find((element) => element.stat.name === bar.identifier).base_stat

    drawStatBar(ctx, initialX, initialY + (yIncrement * i), barWidth, barHeight, bar.color1, bar.color2, bar.name, barValue, bar.max)
  }
}

function drawStatBar (ctx, x, y, width, height, color1, color2, statName, statValue, maxValue) {
  const texts = [{
    text: `${statName}: ${statValue}`,
    style: 'black',
    font: '12px Consolas',
    x: x + (width / 2),
    y: y + (height / 2)
  }]

  const rects = [{
    x: x,
    y,
    width,
    height,
    style: color2
  },
  {
    x: x,
    y,
    width: (width / maxValue) * statValue,
    height,
    style: color1
  }]

  const cvHelper = new CanvasHelper(ctx)

  cvHelper.drawRects(rects)
  cvHelper.drawTexts(texts)
}
