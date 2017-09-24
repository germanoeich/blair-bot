import express from 'express'
import Prometheus from 'prom-client'

const msgSeenCounter = new Prometheus.Counter({ name: 'blair_messages_seen', help: 'Number of messages Blair has seen' })
const commandsCounter = new Prometheus.Counter({ name: 'blair_commands_total', help: 'Number of commands Blair has executed' })
const guildsGauge = new Prometheus.Gauge({ name: 'blair_guilds_total', help: 'Current number of guilds' })

function expose () {
  const app = express()

  app.get('/metrics', (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType)
    res.end(Prometheus.register.metrics())
  })

  app.listen(9300, function () {
    console.log('Exposing metrics on port 9300')
  })

  const collectDefaultMetrics = Prometheus.collectDefaultMetrics

  collectDefaultMetrics({ timeout: 5000 })
}

function registerEvents (bot) {
  bot.on('messageCreate', (msg) => {
    msgSeenCounter.inc()
    if (msg.command) {
      commandsCounter.inc()
    }
  })

  guildsGauge.set(bot.guilds.size)

  bot.on('guildDelete', (guild) => {
    guildsGauge.set(bot.guilds.size)
  })

  bot.on('guildCreate', (guild) => {
    guildsGauge.set(bot.guilds.size)
  })
}

export default {
  expose,
  registerEvents
}
