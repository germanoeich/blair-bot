import kick from './kick'
import role from './role'
import PrefixCmd from './prefix'

function register (bot) {
  (new PrefixCmd(bot)).register()
  kick.register(bot)
  role.register(bot)
}

export default {
  categoryName: 'Moderation',
  register
}
