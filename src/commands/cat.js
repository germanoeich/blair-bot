import fetch from 'node-fetch'
import chalk from 'chalk'

const info = {
  name: 'cat',
  description: 'fetch a random cat image'
}

async function action () {
  try {
    var response = await fetch('http://random.cat/meow')
    return (await response.json()).file
  } catch (e) {
    console.error('ERR:', chalk.red(e))
    return `Shit happened when it shouldn't have. Most likely random.cat is having problems.`
  }
}

function register (bot) {
  bot.registerCommand(info.name, action, info)
}

export default {
  info,
  register
}
