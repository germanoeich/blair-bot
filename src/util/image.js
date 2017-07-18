import { Image } from 'canvas'
import fetch from 'node-fetch'

async function loadImage (url) {
  const response = await fetch(url)
  const data = await response.buffer()
  const img = new Image()
  img.src = data
  return img
}

export function drawRects (ctx, rects) {
  rects.forEach(function (element) {
    ctx.fillStyle = element.style
    ctx.fillRect(element.x, element.y, element.width, element.height)
  })
}

export function drawTexts (ctx, texts) {
  texts.forEach(function (element) {
    ctx.fillStyle = element.style
    ctx.font = element.font
    ctx.fillText(element.text, element.x, element.y)
  })
}

export async function loadAndDrawImages (ctx, images, drawGuideLines) {
  await Promise.all(images.map(async function (element) {
    const img = await loadImage(element.url)
    element.img = img
  }))

  images.forEach(function (element) {
    ctx.drawImage(element.img, element.x, element.y, element.width, element.height)

    if (drawGuideLines) {
      ctx.strokeStyle = 'green'
      ctx.strokeRect(element.x, element.y, element.width, element.height)
    }
  })
}
