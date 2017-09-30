import BaseCommand from './../baseCommand'
import Responder from './../../lib/messages/responder'
import redis from './../../data/redis'
import matcher from 'matcher'

export default class TextCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'text',
      usage: '<block|list> <expression>',
      argsRequired: true,
      description: 'Text management command',
      fullDescription: 'Text management command to block or transfer text to the proper channels',
      requirements: {
        permissions: {
          'manageMessages': true
        }
      },
      permissionMessage: 'You need the "Manage Messages" permission.',
      invalidUsageMessage: 'Specify an operation'
    }
    super(info, bot)
    this.addSubCommand(new BlockCmd(bot))
    this.addSubCommand(new ListCmd(bot))
  }
}

class ListCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'list',
      usage: 'list',
      description: 'List all text rules',
      fullDescription: 'List all text rules'
    }
    super(info, bot)
    this.redisClient = redis.connect()
  }

  async action (msg, args) {
    console.log('list')
    const guildId = msg.channel.guild.id
    const channelId = msg.channel.id
    const keyIdentifier = `text:block:${guildId}:${channelId}`
    const responder = new Responder(msg.channel)

    let keys = await this.redisClient.smembers(keyIdentifier)

    if (keys.length === 0) {
      responder.info('There are no text rules for this channel')
    }

    responder.info(`There are ${keys.length} text block rules for this channel:`)
             .newline()
             .codeStart('', 'Haskell')

    for (var i = 0; i < keys.length; i++) {
      responder.text(`[${i}] ${keys[i]}`).newline()
    }

    await responder.codeEnd('').send()
  }
}

// TODO: Handle bot permissions
class BlockCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'block',
      usage: 'block <expression>',
      argsRequired: true,
      description: 'Blocks (deletes and warn user) a message',
      fullDescription: 'Blocks (deletes and warn user) a message based on the Expression provided. Expressions are text with wildcards ( * )',
      requirements: {
        permissions: {
          'manageMessages': true
        }
      },
      permissionMessage: 'You need the "Manage Messages" permission.',
      invalidUsageMessage: 'Specify an Expression'
    }
    super(info, bot)

    this.handleMessageCreate = this.handleMessageCreate.bind(this)
    this.handleMessageUpdate = this.handleMessageUpdate.bind(this)
    this.matchMessage = this.matchMessage.bind(this)

    bot.on('messageCreate', this.handleMessageCreate)
    bot.on('messageUpdate', this.handleMessageUpdate)

    this.redisClient = redis.connect()
  }

  async matchMessage (msg) {
    const guildId = msg.channel.guild.id
    const channelId = msg.channel.id
    const keyIdentifier = `text:block:${guildId}:${channelId}`

    let keys = await this.redisClient.smembers(keyIdentifier)
    if (keys.length > 0) {
      for (let k of keys) {
        if (matcher.isMatch(msg.content, k)) {
          const responder = new Responder(msg.channel)

          msg.delete(`Triggered by [${k}] block rule`)
          .catch((e) => {
            const error = JSON.parse(e.response)
            if (error.code !== 10008) {
              console.error(e)
            }
          })
          responder.error(`${msg.author.mention}, your message was removed based on a block rule.`).ttl(10).send()
          break
        }
      }
    }
  }

  async handleMessageUpdate (msg, oldMsg) {
    if (!oldMsg || msg.author.bot) {
      return
    }
    this.matchMessage(msg)
  }

  async handleMessageCreate (msg) {
    if (!!msg.command || msg.author.bot) {
      return
    }
    this.matchMessage(msg)
  }

  async action (msg, args) {
    const responder = new Responder(msg.channel)

    if (args[0][0] === '!') {
      await responder.error('A block expression cannot start with !').send()
      return
    }

    const exp = args.join(' ')
    const guildId = msg.channel.guild.id
    const channelId = msg.channel.id

    await this.redisClient.sadd(`text:block:${guildId}:${channelId}`, exp)
    await responder.success('Added channel text block').send()
  }
}
