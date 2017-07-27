import { Image } from 'canvas'
import fetch from 'node-fetch'

class CanvasHelper {
  constructor (ctx) {
    this.ctx = ctx
  }

  async loadImage (url) {
    const response = await fetch(url)
    const data = await response.buffer()
    const img = new Image()
    img.src = data
    return img
  }

  drawRects (rects) {
    rects.forEach((element) => {
      this.ctx.fillStyle = element.style
      this.ctx.fillRect(element.x, element.y, element.width, element.height)
    })
  }

  drawTexts (texts) {
    texts.forEach((element) => {
      this.ctx.fillStyle = element.style
      this.ctx.font = element.font
      this.ctx.textAlign = element.textAlign || 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.fillText(element.text, element.x, element.y)
    })
  }

  drawOutlines (outlines) {
    outlines.forEach((element) => {
      this.ctx.strokeStyle = element.style
      this.ctx.lineWidth = element.lineWidth
      this.ctx.strokeRect(element.x, element.y, element.width, element.height)
    })
  }

  async loadAndDrawImages (images, drawGuideLines) {
    await Promise.all(images.map(async (element) => {
      const img = await this.loadImage(element.url)
      element.img = img
    }))

    images.forEach((element) => {
      this.ctx.drawImage(element.img, element.x, element.y, element.width, element.height)

      if (drawGuideLines) {
        this.ctx.strokeStyle = 'grey'
        this.ctx.strokeRect(element.x, element.y, element.width, element.height)
      }
    })
  }
}

export default CanvasHelper
