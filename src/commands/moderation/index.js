import kick from './kick'
import role from './role'
import prefix from './prefix'

function register (bot) {
  prefix.register(bot)
  kick.register(bot)
  role.register(bot)
}

export default {
  categoryName: 'Moderation',
  register
}
