import Canvas from 'canvas'
import { capitalizeName } from './../util/pokemon-names'
import { drawRects, drawTexts, drawOutlines, loadAndDrawImages } from './../util/image'

const padding = 10
const maxwidth = 240
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
    x: maxwidth / 2,
    y: 35
  }]

  const noFrontSpriteText = {
    text: '?',
    style: 'lightgray',
    font: '48px Consolas',
    x: padding + (imgW / 2),
    y: 60 + (imgH / 2)
  }

  const noBackSpriteText = {
    text: '?',
    style: 'lightgray',
    font: '48px Consolas',
    x: imgW + padding + (imgW / 2),
    y: 60 + (imgH / 2)
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
  await loadAndDrawImages(ctx, images)
  drawTexts(ctx, texts)
}

function drawStatsBlock (pokeinfo, ctx) {
  const initialY = 156

  const maxHp = 255
  const maxAttack = 190
  const maxDefense = 230
  const maxSpAttack = 194

  const hp = pokeinfo.stats.find((element) => element.stat.name === 'hp').base_stat
  const attack = pokeinfo.stats.find((element) => element.stat.name === 'attack').base_stat
  const defense = pokeinfo.stats.find((element) => element.stat.name === 'defense').base_stat
  const spAttack = pokeinfo.stats.find((element) => element.stat.name === 'special-attack').base_stat

  const texts = [{
    text: 'Stats',
    style: 'black',
    font: '22px Consolas',
    textAlign: 'left',
    x: padding + 5,
    y: initialY + padding + 5
  }]

  const barHeight = 20
  const barWidth = (maxwidth - (padding * 2))
  drawStatBar(ctx, padding, initialY + 25, barWidth, barHeight, '#dd0000', '#FF5959', '#ff7575', 'HP', hp, maxHp)
  drawStatBar(ctx, padding, initialY + 50, barWidth, barHeight, '#ff851c', '#ff953a', '#ffb97c', 'Attack', attack, maxAttack)
  drawStatBar(ctx, padding, initialY + 75, barWidth, barHeight, '#ccc900', '#e0de33', '#b2b15b', 'Defense', defense, maxDefense)
  drawStatBar(ctx, padding, initialY + 100, barWidth, barHeight, '#5340ff', '#b0b0ff', '#8080ff', 'Sp.Attack', spAttack, maxSpAttack)
  drawTexts(ctx, texts)
}

function drawStatBar (ctx, x, y, width, height, color1, color2, color3, statName, statValue, maxValue) {
  const texts = [{
    text: `${statName}: ${statValue}`,
    style: 'white',
    font: '16px Consolas',
    x: maxwidth / 2,
    y: y + (height / 2)
  }]

  const outLines = [{
    x: padding,
    y: y,
    width: width,
    height: height,
    style: color2,
    lineWidth: 2
  }]

  const rects = [{
    x: padding,
    y,
    width,
    height,
    style: color3
  },
  {
    x: padding,
    y,
    width: (width / maxValue) * statValue,
    height,
    style: color1
  }]

  drawRects(ctx, rects)
  drawOutlines(ctx, outLines)
  drawTexts(ctx, texts)
}
