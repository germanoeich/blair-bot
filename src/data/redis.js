import config from './../config/config.js'
import Redis from 'ioredis'

function connect () {
  const env = process.env.NODE_ENV || 'dev'
  return new Redis(config.redis[env].port, config.redis[env].host)
}

export default {
  connect
}
