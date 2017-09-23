import express from 'express'
import Prometheus from 'prom-client'

const counter = new Prometheus.Counter({ name: 'blair_messages_seen', help: 'Number of messages Blair has seen' })

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
  bot.on('messageCreate', () => {
    counter.inc()
  })
}

export default {
  expose,
  registerEvents
}
