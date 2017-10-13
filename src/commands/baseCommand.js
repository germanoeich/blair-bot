import integrity from './../lib/internal/integrity'
import Responder from './../lib/messages/responder'
import parser from 'yargs-parser'
import redis from './../data/redis'

export default class BaseCommand {
  constructor (info, commandClient) {
    this.info = info
    this.bot = commandClient

    this.baseAction = this.baseAction.bind(this)
    if (this.action) {
      this.action = this.action.bind(this)
    }

    this.subcommands = []
    this.redisClient = redis.connect()
  }

  addSubCommand (obj) {
    this.subcommands.push(obj)
  }

  startPrompt (msg) {
    if (this.info.mayPrompt) {
      if (!integrity.canPrompt(msg.author)) {
        const responder = new Responder(msg.channel)
        responder.promptBlocked().ttl(10).send()
        return false
      }
      integrity.startPrompt(msg.author)
    }
    return true
  }

  endPrompt (msg) {
    if (this.info.mayPrompt) {
      integrity.endPrompt(msg.author)
    }
  }

  setLastCommand (msg, joinedArgs) {
    const hashKey = `last_cmd:${msg.channel.guild.id}:${msg.author.id}`
    const cmdChain = []
    let currCmd = msg.command
    do {
      cmdChain.push(currCmd.label)
      if (!currCmd.parentCommand) {
        break
      }
      currCmd = currCmd.parentCommand
    }
    while (true)

    cmdChain.reverse()
    this.redisClient.hset(hashKey, 'cmds', cmdChain.join(','), 'args', joinedArgs)
  }

  async checkCommandDisabled (msg) {
    const disabledChannels = await this.redisClient.smembers(`cmd_disable:${msg.channel.guild.id}:${this.info.name}`)

    if (disabledChannels.length === 0) {
      return false
    }

    if (disabledChannels.includes(msg.channel.id)) {
      return true
    }

    return false
  }

  async baseAction (msg, args) {
    const isDisabled = await this.checkCommandDisabled(msg)
    if (isDisabled) {
      return
    }

    let ret = ''
    try {
      if (!this.startPrompt(msg)) {
        return
      }

      const joinedArgs = args.join(' ')
      const parsedArgs = parser(joinedArgs, {
        configuration: {
          'short-option-groups': false,
          'dot-notation': false,
          'duplicate-arguments-array': false,
          'flatten-duplicate-arrays': false,
          // I may come back and change this to true.
          // But for now, things can be simple
          'boolean-negation': false
        }
      })

      ret = await this.action(msg, args, parsedArgs)

      this.setLastCommand(msg, joinedArgs)

      if (parsedArgs.d) {
        msg.delete('Trigerred by -d flag').catch(() => {})
      }

      this.endPrompt(msg)
    } catch (e) {
      this.endPrompt(msg)
      throw e
    }

    if (typeof ret === 'string') {
      return ret
    }
  }

  register () {
    const cmd = this.bot.registerCommand(this.info.name, this.baseAction, this.info)
    this.subcommands.forEach((subCmd) => cmd.registerSubcommand(subCmd.info.name, subCmd.baseAction, subCmd.info))
  }
}
