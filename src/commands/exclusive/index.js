import EvalCmd from './eval'

function register (bot) {
  (new EvalCmd(bot)).register()
}

// No category info because this won't show
// in the help cmd
export default {
  register
}
