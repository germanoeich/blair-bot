import PlayCmd from './play'

const cmds = []

function register (bot) {
  cmds.push(new PlayCmd(bot))
  cmds.forEach((cmd) => cmd.register())
}

export default {
  categoryName: 'Music',
  register
}
