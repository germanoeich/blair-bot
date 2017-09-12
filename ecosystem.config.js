module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'bulbabot',
      script: 'build/index.js',
      env_production: {
        NODE_ENV: 'production'
      },
      wait_ready: true,
      kill_timeout: 4000
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      key: '~/.ssh/bot-deploy',
      // TODO: Create a deploy user
      user: 'gin',
      host: 'bulbabot-vm.eastus.cloudapp.azure.com',
      ref: 'origin/master',
      repo: 'git@github.com:germanoeich/discord-bulbabot.git',
      path: '/var/opt/node/bulbabot',
      'ssh_options': 'StrictHostKeyChecking=no',
      'post-setup': 'cp ./../cfg/config.js src/config/config.js',
      'post-deploy': 'yarn && yarn build && pm2 startOrRestart ecosystem.config.js --env production'
    }
  }
}
