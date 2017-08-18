export default class DeleteQueue {
  constructor () {
    this.queue = []
  }

  add (msg) {
    if (!msg) {
      return
    }

    this.queue.push(msg)
  }

  deleteFirst () {
    if (this.queue.length > 0) {
      const item = this.queue.shift()
      item.delete()
    }
  }

  deleteAll () {
    this.queue.forEach((element) => {
      element.delete()
    })
  }
}
