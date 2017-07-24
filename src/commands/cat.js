import fetch from 'node-fetch'
import chalk from 'chalk'

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
  bot.registerCommand('cat', action, {
    description: 'Fetch a random cat image',
    fullDescription: 'Fetches a random cat image'
  })
}

export default {
  register
}
