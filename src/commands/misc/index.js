import PingCmd from './ping'
import StatsCmd from './stats'
import RepeatCommandCmd from './repeatcommand'

const cmds = []

function register (bot) {
  cmds.push(new PingCmd(bot))
  cmds.push(new StatsCmd(bot))
  cmds.push(new RepeatCommandCmd(bot))

  cmds.forEach((cmd) => cmd.register())
}

export default {
  categoryName: 'Misc',
  register,
  cmds
}
