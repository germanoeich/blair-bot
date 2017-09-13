import Eris from 'eris'
import chalk from 'chalk'
import config from './config/config.js'
import cmdConfig from './config/command-config.js'
import { registerCommands } from './commands'
import { init } from './lib'

let _bot
export async function connect () {
  _bot = new Eris.CommandClient(config.token, { autoreconnect: false }, {
    prefix: ['@mention ', 'b!'],
    owner: 'Gin#1913',
    // defaultHelpCommand: false,
    defaultCommandOptions: cmdConfig.defaultCommandOptions
  })

  _bot.on('ready', () => {
    init(_bot)
    registerCommands(_bot)
    if (process.send) {
      process.send('ready')
    }
    console.log('Ready!')
  })

  _bot.on('error', (msg) => console.error(chalk.red('ERROR:', msg)))
  _bot.on('warn', (msg) => console.warn(chalk.yellow('WARN:', msg)))

  if (process.env.NODE_ENV === 'dev') {
    _bot.on('debug', (msg) => console.log(chalk.green('DEBUG:', msg)))
  }

  // For systems with signals support
  process.on('SIGINT', async () => {
    await disconnect()
  })
  // For systems without signals support (I'm looking at you, Windows)
  process.on('message', async (msg) => {
    if (msg === 'shutdown') {
      await disconnect()
    }
  })

  return _bot.connect()
}

async function disconnect () {
  if (!_bot) {
    return
  }

  try {
    await _bot.disconnect({ reconnect: false })
    console.info(chalk.green('INFO: Bot killed gracefully by SIGINT'))
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

// STARTUP

if (process.env.NODE_ENV !== 'test') {
  connect()
}
