import BaseCommand from './../baseCommand'
import Responder from './../../lib/messages/responder'
import OptionSelector from './../../lib/messages/optionSelector'
import matcher from 'matcher'

export default class AutomodCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'automod',
      usage: 'block <expression> | list|remove',
      argsRequired: true,
      description: 'Sets/Lists/Removes channel text rules',
      fullDescription: 'Sets a block rule for a given expression, lists blocks rules or removes them',
      requirements: {
        permissions: {
          'manageMessages': true
        }
      },
      permissionMessage: 'You need the "Manage Messages" permission.',
      invalidUsageMessage: 'Specify an operation',
      guildOnly: true
    }
    super(info, bot)
    this.addSubCommand(new BlockCmd(bot))
    this.addSubCommand(new ListCmd(bot))
    this.addSubCommand(new RemoveBlockCmd(bot))
  }
}

class RemoveBlockCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'remove',
      usage: 'remove',
      description: 'Removes a text block',
      fullDescription: 'Used to remove text blocks. This command has no arguments, and will prompt you for rule selection',
      requirements: {
        permissions: {
          'manageMessages': true
        }
      },
      permissionMessage: 'You need the "Manage Messages" permission.',
      mayPrompt: true
    }
    super(info, bot)
  }

  async action (msg, args) {
    const guildId = msg.channel.guild.id
    const channelId = msg.channel.id
    const keyIdentifier = `text:block:${guildId}:${channelId}`
    const responder = new Responder(msg.channel)

    const keys = await this.redisClient.smembers(keyIdentifier)

    if (keys.length === 0) {
      responder.info('There are no text rules for this channel').send()
      return
    }

    responder.info(`Type an ID to remove the rule, type 'all' to remove all rules, type 'cancel' to exit`)
             .newline()
             .codeStart('', 'Haskell')

    for (var i = 0; i < keys.length; i++) {
      responder.text(`[${i}] ${keys[i]}`).newline()
    }

    const botMsg = await responder.codeEnd('').send()
    const optionSelector = new OptionSelector(msg, keys)

    var response = await optionSelector.queryUser(botMsg, true)

    if (response.type === 'cancel') {
      return
    }

    if (response.type === 'all') {
      this.redisClient.del(keyIdentifier)
      responder.success('Succesfully deleted all rules for this channel').send()
    } else {
      this.redisClient.srem(keyIdentifier, response)
      responder.success(`Succesfully deleted rule ${response}`).send()
    }
  }
}

class ListCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'list',
      usage: 'list',
      description: 'Lists text blocks',
      fullDescription: 'Lists all text blocks for the channel'
    }
    super(info, bot)
  }

  async action (msg, args) {
    const guildId = msg.channel.guild.id
    const channelId = msg.channel.id
    const keyIdentifier = `text:block:${guildId}:${channelId}`
    const responder = new Responder(msg.channel)

    let keys = await this.redisClient.smembers(keyIdentifier)

    if (keys.length === 0) {
      responder.info('There are no text rules for this channel').send()
      return
    }

    responder.info(`There are ${keys.length} text block rules for this channel:`)
             .newline()
             .codeStart('', 'Haskell')

    for (var i = 0; i < keys.length; i++) {
      responder.text(`${keys[i]}`).newline()
    }

    await responder.codeEnd('').send()
  }
}

// TODO: Handle bot permissions
class BlockCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'block',
      usage: 'block "<expression>"',
      argsRequired: true,
      description: 'Sets a text block for the channel',
      fullDescription:
      'Creates a new text block rule for the channel, based on the provided Expression.\n' +
      'Expressions are matched based on wildcards:\n' +
      '`block "rip"`\nWill only delete messages that ONLY contain the text "rip".\n' +
      '`block "*rip*"\nWill delete all messages that contain "rip" in them. But will also delete a message with the word "ripped" in it.\n' +
      '`block "* rip *"\nWill delete only messages containing the word "rip".\n' +
      'If the block rule contains whitespaces in it, you need to wrap the expression in double or single quotes\n' +
      'Expressions can\'t start with "!"',
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

  async action (msg, args, parsedArgs) {
    const responder = new Responder(msg.channel)

    if (parsedArgs._[0][0] === '!') {
      await responder.error('A block expression cannot start with !').send()
      return
    }

    const exp = parsedArgs._[0]
    const guildId = msg.channel.guild.id
    const channelId = msg.channel.id

    if (parsedArgs._.length > 1) {
      await responder
              .info('You provided an expression with spaces but didn\'t enclose it in quotes, please do and try again.')
              .ttl(15).send()
      return
    }

    await this.redisClient.sadd(`text:block:${guildId}:${channelId}`, exp)
    await responder.success('Added channel text block').send()
  }
}
