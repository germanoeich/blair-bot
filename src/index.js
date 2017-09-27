import Eris from 'eris'
import chalk from 'chalk'
import config from './config/config.js'
import cmdConfig from './config/command-config.js'
import { registerCommands } from './commands'
import { init } from './lib'
import { initPlayer } from './lib/lavalink/player'
import redis from './data/redis.js'
import metrics from './metrics'
import Raven from 'raven'
let _bot

export async function connect () {
  Raven.config(config.sentry.dsn, {
    environment: process.env.NODE_ENV,
    release: config.sentry.release
  }).install(function (err, sendErr, eventId) {
    if (!sendErr) {
      console.log('Successfully sent fatal error with eventId ' + eventId + ' to Sentry:')
    }
    console.error(err.stack)

    // process.exit(1)
  })

  _bot = new Eris.CommandClient(config.token, {
    getAllUsers: true,
    maxShards: 2
  }, {
    prefix: ['@mention ', 'b!'],
    owner: 'Gin#1913',
    // defaultHelpCommand: false,
    defaultCommandOptions: cmdConfig.defaultCommandOptions,
    ignoreBots: process.env.NODE_ENV !== 'test'
  })

  _bot.on('ready', async () => {
    init(_bot)
    initPlayer(_bot, config.lavalink.hosts)

    registerCommands(_bot)
    await applyGuildPrefixes()
    if (process.send) {
      process.send('ready')
    }

    // Purple looks so nice with the avatar...
    _bot.editStatus('online', { name: 'b!help', type: 1, url: 'https://www.twitch.tv/notgin' })

    if (process.env.NODE_ENV !== 'production') {
      metrics.registerEvents(_bot)
    }

    console.log('Ready!')
  })

  _bot.on('error', (e) => {
    console.error(chalk.red('ERROR:', e))
    Raven.captureException(e)
  })
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
    console.info(chalk.green('INFO: Bot killed gracefully'))
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

async function applyGuildPrefixes () {
  redis.client = redis.connect()

  const keys = await redis.client.keys(`guild_prefix:*`)

  if (keys.length === 0) {
    redis.client.disconnect()
    return
  }

  const values = await redis.client.mget(keys)

  var substrLength = 'guild_prefix:'.length

  for (var i = 0; i < keys.length; i++) {
    _bot.registerGuildPrefix(keys[i].substring(substrLength), ['@mention ', values[i]])
  }

  redis.client.disconnect()
}

// STARTUP

if (process.env.NODE_ENV !== 'test') {
  try {
    connect()
  } catch (e) {
    console.error(chalk.red(e))
  }
}
