import BaseCommand from './../baseCommand'

export default class DiceCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'dice',
      usage: '[Number Of Sides] [Number Of Dices]',
      description: 'Rolls a number',
      fullDescription: 'Rolls a number. Args defaults to 6 sides and 1 dice'
    }

    super(info, bot)
  }

  action (msg, args) {
    if (args.length === 0) {
      return 'You rolled a ' + this.randomInt(1, 6)
    }

    if (args.length === 1) {
      return 'You rolled a ' + this.randomInt(1, args[0])
    }

    if (args.length === 2) {
      let response = 'You rolled '
      let total = 0
      for (var i = 0; i < args[1]; i++) {
        const roll = this.randomInt(1, args[0])
        total += roll
        response += `${roll} `

        if (i !== args[1] - 1) {
          response += '+ '
        }
      }

      response += `totalling ${total}.`
      return response
    }
  }

  randomInt (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low)
  }
}
