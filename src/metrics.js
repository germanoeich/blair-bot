import { StatsD } from 'node-dogstatsd'
var dogstatsd = new StatsD()

function registerEvents (bot) {
  bot.on('messageCreate', (msg) => {
    dogstatsd.increment('blair.messages_total')
    if (msg.command) {
      dogstatsd.increment('blair.commands_total')
    }
  })

  dogstatsd.gauge('blair.guilds_total', bot.guilds.size)

  bot.on('guildDelete', (guild) => {
    dogstatsd.gauge('blair.guilds_total', bot.guilds.size)
  })

  bot.on('guildCreate', (guild) => {
    dogstatsd.gauge('blair.guilds_total', bot.guilds.size)
  })
}

export default {
  registerEvents
}
