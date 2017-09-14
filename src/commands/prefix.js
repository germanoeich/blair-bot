import redis from './../data/redis.js'
import Responder from './../lib/messages/responder.js'

const info = {
  name: 'prefix',
  usage: '<prefix>',
  description: 'Changes the bot prefix.',
  fullDescription: 'Changes the bot prefix.',
  caseInsensitive: true,
  argsRequired: true,
  requirements: {
    permissions: {
      'administrator': true
    }
  },
  permissionMessage: 'You need to be an administrator to set this.',
  invalidUsageMessage: 'Specify an prefix'
}

let _bot
let _redisClient

async function action (msg, args) {
  const responder = new Responder(msg.channel)
  try {
    const newPrefix = args[0]

    const guild = msg.channel.guild
    _bot.registerGuildPrefix(guild.id, [ '@mention', newPrefix ])

    await _redisClient.set(`guild_prefix:${guild.id}`, newPrefix)

    await responder.success(`Guild prefix set to '${newPrefix}'`).send()
  } catch (e) {
    console.error(e)
    await responder.error('Error while setting the guild prefix. Probably on our end, try again later please.').send()
  }
}

function register (bot) {
  _bot = bot
  _redisClient = redis.connect()
  bot.registerCommand(info.name, action, info)
}

export default {
  info,
  register
}
