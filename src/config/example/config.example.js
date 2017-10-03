const config = {
  token: {
    production: '<TOKEN>',
    dev: '<TOKEN>',
    test: '<TOKEN>'
  },
  redis: {
    dev: {
      host: 'localhost',
      port: 6379
    },
    test: {
      host: 'localhost',
      port: 6379
    },
    production: {
      host: '<HOST>',
      port: 6379
    }
  },
  sentry: {
    production: {
      dsn: '<DSN>',
      // This is used to track releases on sentry. Don't change this value, it get's replaced
      // by sentryRelease.sh
      release: 'RELEASE_REPLACE_TOKEN'
    },
    dev: {
      dsn: false
    },
    test: {
      dsn: false
    }
  },
  lavalink: {
    production: {
      hosts: [
        { host: '<HOST>', port: 80, region: 'us', password: '' }
      ]
    },
    test: {
      hosts: [
        { host: 'localhost', port: 80, region: 'us', password: '' }
      ]
    },
    dev: {
      hosts: [
        { host: 'localhost', port: 80, region: 'us', password: '' }
      ]
    }
  }
}

const redis = config.redis[process.env.NODE_ENV]
const sentry = config.sentry[process.env.NODE_ENV]
const lavalink = config.lavalink[process.env.NODE_ENV]
const token = config.token[process.env.NODE_ENV]

export default {
  redis,
  sentry,
  lavalink,
  token
}
