import config from './../config/config.js'
import Redis from 'ioredis'

function connect () {
  return new Redis(config.redis.port, config.redis.host)
}

export default {
  connect
}
