function action (msg, args) {
  console.log(`dice with args ${args}`)
  if (args.length === 0) {
    return 'You rolled a ' + randomInt(1, 6)
  }

  if (args.length === 1) {
    return 'You rolled a ' + randomInt(1, args[0])
  }

  if (args.length === 2) {
    let response = 'You rolled '
    let total = 0
    for (var i = 0; i < args[1]; i++) {
      const roll = randomInt(1, args[0])
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

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}

function register (bot) {
  bot.registerCommand('dice', action, {
    description: 'Rolls a number',
    fullDescription: 'Rolls a number. Usage: b!dice [number of sides] [number of dices], defaults to 6 sides and 1 dice'
  })
}

export default {
  register
}
