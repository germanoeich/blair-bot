import PlayCmd from './play'
import StopCmd from './stop'

const cmds = []

function register (bot) {
  cmds.push(new PlayCmd(bot))
  cmds.push(new StopCmd(bot))

  cmds.forEach((cmd) => cmd.register())
}

export default {
  categoryName: 'Music',
  register,
  cmds
}
