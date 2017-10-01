import KickCmd from './kick'
import RoleCmd from './role'
import PrefixCmd from './prefix'
import TextCmd from './text'

const cmds = []

function register (bot) {
  cmds.push(new PrefixCmd(bot))
  cmds.push(new TextCmd(bot))
  cmds.push(new RoleCmd(bot))
  cmds.push(new KickCmd(bot))

  cmds.forEach((cmd) => cmd.register())
}

export default {
  categoryName: 'Moderation',
  register
}
