import Eris from 'eris'
import chalk from 'chalk'
import config from './config/config.js'
import cmdConfig from './config/command-config.js'
import { registerCommands } from './commands'
import { init } from './lib'

export async function connect () {
  var _bot = new Eris.CommandClient(config.token, { autoreconnect: false }, {
    prefix: ['@mention ', 'b!'],
    owner: 'Gin#1913',
    // defaultHelpCommand: false,
    defaultCommandOptions: cmdConfig.defaultCommandOptions
  })

  _bot.on('ready', () => {
    init(_bot)
    registerCommands(_bot)
    console.log('Ready!')
  })

  _bot.on('error', (msg) => console.error(chalk.red('ERROR:', msg)))
  _bot.on('warn', (msg) => console.warn(chalk.yellow('WARN:', msg)))

  if (process.env.NODE_ENV === 'dev') {
    _bot.on('debug', (msg) => console.log(chalk.green('DEBUG:', msg)))
  }

  return _bot.connect()
}

if (process.env.NODE_ENV !== 'test') {
  connect()
}
