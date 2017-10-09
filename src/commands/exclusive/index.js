import EvalCmd from './eval'

const cmds = []

function register (bot) {
  cmds.push(new EvalCmd(bot))

  cmds.forEach((cmd) => cmd.register())
}

// No category info because this won't show
// in the help cmd
export default {
  register,
  cmds
}
