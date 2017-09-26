import { StatsD } from 'node-dogstatsd'
var dogstatsd = new StatsD()

function registerEvents (bot) {
  bot.on('messageCreate', (msg) => {
    dogstatsd.increment('blair.messages_total')
    if (msg.command) {
      dogstatsd.incrementBy('blair.commands_total', 1, [`cmdName:${msg.command.name}`])
    }
  })
  setInterval(() => {
    dogstatsd.gauge('blair.guilds_total', bot.guilds.size)
  }, 10000)
}

export default {
  registerEvents
}
