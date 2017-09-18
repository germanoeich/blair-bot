import fetch from 'node-fetch'
import chalk from 'chalk'

const info = {
  name: 'inspiro',
  description: 'fetch a inspirobot image',
  alias: 'inspirobot'
}

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
  bot.registerCommand(info.name, action, info)
  bot.registerCommandAlias(info.alias, info.name)
}

export default {
  info,
  register
}
