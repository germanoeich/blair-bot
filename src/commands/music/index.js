import PlayCmd from './play'
import StopCmd from './stop'
import LeaveCmd from './leave'
import JoinCmd from './join'
import ListenMoeCmd from './listenmoe'

const cmds = []

function register (bot) {
  cmds.push(new PlayCmd(bot))
  cmds.push(new StopCmd(bot))
  cmds.push(new LeaveCmd(bot))
  cmds.push(new JoinCmd(bot))
  cmds.push(new ListenMoeCmd(bot))

  cmds.forEach((cmd) => cmd.register())
}

export default {
  categoryName: 'Music',
  register,
  cmds
}
