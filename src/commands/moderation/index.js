import kick from './kick'
import role from './role'
import PrefixCmd from './prefix'
import TextCmd from './text'

const cmds = []

function register (bot) {
  cmds.push(new PrefixCmd(bot))
  cmds.push(new TextCmd(bot))

  cmds.forEach((cmd) => cmd.register())
  kick.register(bot)
  role.register(bot)
}

export default {
  categoryName: 'Moderation',
  register
}
