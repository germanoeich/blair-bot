import Canvas from 'canvas'
import { capitalizeName } from './../util/pokemon-names'
import { drawRects, drawTexts, drawOutlines, loadAndDrawImages } from './../util/image'

const padding = 10
const maxwidth = 400
const maxheight = 300
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
  console.log('\x1b[32m', `Drawing "${pokeinfo.name}" block`)

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

  drawRects(ctx, rects)
  await loadAndDrawImages(ctx, images, true)
  drawTexts(ctx, texts)
}

function drawStatsBlock (pokeinfo, ctx) {
  const initialY = 60
  const initialX = padding + 96 + padding

  const maxHp = 255
  const maxAttack = 190
  const maxDefense = 230
  const maxSpAttack = 194
  const maxSpDefense = 230
  const maxSpeed = 180

  const hp = pokeinfo.stats.find((element) => element.stat.name === 'hp').base_stat
  const attack = pokeinfo.stats.find((element) => element.stat.name === 'attack').base_stat
  const defense = pokeinfo.stats.find((element) => element.stat.name === 'defense').base_stat
  const spAttack = pokeinfo.stats.find((element) => element.stat.name === 'special-attack').base_stat
  const spDefense = pokeinfo.stats.find((element) => element.stat.name === 'special-defense').base_stat
  const speed = pokeinfo.stats.find((element) => element.stat.name === 'speed').base_stat

  const barHeight = 15
  const barWidth = (maxwidth - initialX - padding)
  drawStatBar(ctx, initialX, initialY, barWidth, barHeight, '#FF0000', '#FF5959', '#A60000', 'HP', hp, maxHp)
  drawStatBar(ctx, initialX, initialY + 20, barWidth, barHeight, '#F08030', '#F5AC78', '#9C531F', 'Attack', attack, maxAttack)
  drawStatBar(ctx, initialX, initialY + 40, barWidth, barHeight, '#F8D030', '#FAE078', '#A1871F', 'Defense', defense, maxDefense)
  drawStatBar(ctx, initialX, initialY + 60, barWidth, barHeight, '#6890F0', '#9DB7F5', '#445E9C', 'Sp.Attack', spAttack, maxSpAttack)
  drawStatBar(ctx, initialX, initialY + 80, barWidth, barHeight, '#78C850', '#A7DB8D', '#4E8234', 'Sp.Defense', spDefense, maxSpDefense)
  drawStatBar(ctx, initialX, initialY + 100, barWidth, barHeight, '#F85888', '#FA92B2', '#A13959', 'Speed', speed, maxSpeed)
}

function drawStatBar (ctx, x, y, width, height, color1, color2, color3, statName, statValue, maxValue) {
  const texts = [{
    text: `${statName}: ${statValue}`,
    style: 'black',
    font: '12px Consolas',
    x: x + (width / 2),
    y: y + (height / 2)
  }]

  const outLines = [{
    x: x,
    y: y,
    width: width,
    height: height,
    style: color3,
    lineWidth: 1
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

  drawRects(ctx, rects)
  drawOutlines(ctx, outLines)
  drawTexts(ctx, texts)
}
