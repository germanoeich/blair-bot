import { bot } from './../index.js'

class FormatedString {
  constructor (str) {
    this.str = str
    var formattingOptions = [
      { name: 'italic', symbol1: '*', symbol2: '*', mode: 'surround' },
      { name: 'bold', symbol1: '**', symbol2: '**', mode: 'surround' },
      { name: 'underline', symbol1: '__', symbol2: '__', mode: 'surround' },
      { name: 'inlineCode', symbol1: '`', symbol2: '`', mode: 'surround' },
      { name: 'code', symbol1: '```{{args}}\n', symbol2: '```', mode: 'args-surround' },
      { name: 'bold', symbol1: '**', symbol2: '**', mode: 'surround' },
      { name: 'success', symbol1: '**:white_check_mark: - ', symbol2: '**', mode: 'surround' },
      { name: 'invalidInput', msg: '**:x: - Invalid input, please try again**', mode: 'msg' },
      { name: 'promptTimeout', msg: '**:x: - Prompt cancelled because of inactivity**', mode: 'msg' },
      { name: 'promptBlocked', msg: '**:x: - You already have an active prompt**', mode: 'msg' }
    ]

    // Basically we turn that array of formatting options into actual chainable methods
    formattingOptions.forEach((element) => {
      if (element.mode === 'prefix') {
        this[element.name] = function (str) {
          this.str += `${element.symbol1}${str}`
          return this
        }
      }

      if (element.mode === 'surround') {
        this[element.name] = function (str) {
          this.str += `${element.symbol1}${str}${element.symbol2}`
          return this
        }
      }

      if (element.mode === 'args-surround') {
        this[element.name] = function (str, args) {
          this.str += `${element.symbol1.replace('{{args}}', args || '')}${str}${element.symbol2}`
          return this
        }
      }

      if (element.mode === 'msg') {
        this[element.name] = function () {
          this.str = element.msg
          return this
        }
      }
    })
  }

  text (str) {
    this.str += str
    return this
  }

  newline () {
    this.str += '\n'
    return this
  }
}

class Responder extends FormatedString {
  constructor (channel) {
    super('')
    this.channel = channel

    this.str = ''
    this._file = undefined
    this._embed = undefined
    this._ttl = 0
  }

  error (str, ttl = 15) {
    this.str += `**:x: - ${str}**`
    this.ttl(ttl)
    return this
  }

  file (file) {
    this._file = file
    return this
  }

  embed (embedObj) {
    this._embed = embedObj
    console.log(this._embed)
    return this
  }

  ttl (seconds) {
    this._ttl = seconds * 1000
    return this
  }

  async send () {
    try {
      var ret = await bot.createMessage(this.channel.id,
      { content: this.str, embed: this._embed },
      this._file)

      if (this._ttl > 0) {
        setTimeout(() => ret.delete(), this._ttl)
      }

      this.str = ''
      this._embed = undefined
      this._file = undefined
      this._ttl = 0

      return ret
    } catch (e) {
      const error = JSON.parse(e.response)
      if (error.code !== 50013) {
        console.error(e)
      }
    }
  }

  async waitSingle (userMsg, timeout = 60) {
    return new Promise((resolve, reject) => {
      bot.on('messageCreate', function (msg) {
        if (msg.author.id === userMsg.author.id && msg.channel.id === userMsg.channel.id) {
          resolve(msg)
        }
      })

      setTimeout(() => {
        reject(new Error('timeout'))
      }, timeout * 1000)
    })
  }
}

export default Responder
