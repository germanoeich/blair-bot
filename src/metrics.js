import { StatsD } from 'node-dogstatsd'
var dogstatsd = new StatsD()

function registerEvents (bot) {
  bot.on('messageCreate', (msg) => {
    dogstatsd.increment('blair.messages_total')
    if (msg.command) {
      let label = msg.command.label

      if (msg.command.parentCommand) {
        label = `${msg.command.parentCommand.label} ${label}`
      }

      dogstatsd.increment('blair.commands_total', [`cmd:${label}`])
    }
  })
  setInterval(() => {
    dogstatsd.gauge('blair.guilds_total', bot.guilds.size)
  }, 10000)
}

export default {
  registerEvents
}
