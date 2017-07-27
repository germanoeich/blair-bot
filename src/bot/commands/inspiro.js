import fetch from 'node-fetch'
import chalk from 'chalk'

async function action () {
  try {
    var response = await fetch('http://inspirobot.me/api?generate=true')

    return await response.text()
  } catch (e) {
    console.error('ERR:', chalk.red(e))
    return `Shit happened when it shouldn't have. Most likely InspiroBot is having problems.`
  }
}

function register (bot) {
  bot.registerCommand('inspiro', action, {
    description: 'Fetch a InspiroBot image',
    fullDescription: 'Fetches a fresh inspirobot generated image. Enjoy the wonders of this (most likely not) inspirational AI!'
  })
}

export default {
  register
}
