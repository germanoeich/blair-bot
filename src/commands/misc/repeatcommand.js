import BaseCommand from './../baseCommand'

export default class RepeatCommandCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'repeatcommand',
      description: 'Repeats your last command',
      fullDescription: 'Repeats the last command you used in this guild. Shorthand "rc" is also available',
      aliases: ['rc']
    }
    super(info, bot)
  }

  async baseAction (msg, args) {
    return this.action(msg, args)
  }

  async action (msg, args) {
    const hashKey = `last_cmd:${msg.channel.guild.id}:${msg.author.id}`
    const hashObj = await this.redisClient.hgetall(hashKey)
    const cmdChain = hashObj.cmds.split(',')

    let cmd = this.bot.commands[cmdChain[0]]
    for (let i = 1; i < cmdChain.length; i++) {
      cmd = cmd.subcommands[cmdChain[i]]
    }

    msg.command = cmd
    return cmd.execute(msg, hashObj.args.split(' '))
  }
}
