module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'BulbaBot',
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
      user: 'gin',
      host: 'bulbabot-vm.eastus.cloudapp.azure.com',
      ref: 'origin/master',
      repo: 'git@github.com:germanoeich/discord-bulbabot.git',
      path: '/home/gin/discord-bulbabot',
      'ssh_options': 'StrictHostKeyChecking=no',
      // This will be executed on the host after cloning the repository
      // eg: placing configurations in the shared dir etc
      'post-setup': 'sudo cp /srv/bulbabot/cfg/secrets.js src/config/secrets.js',
      // Commands to execute locally (on the same machine you deploy things)
      // Can be multiple commands separated by the character ';'
      'pre-deploy-local': 'echo "This is a local executed command"',
      // Commands to be executed on the server after the repo has been cloned
      'post-deploy': 'yarn && yarn build && pm2 startOrRestart ecosystem.config.js --env production'
    }
  }
}
