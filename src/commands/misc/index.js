import ping from './ping'
import stats from './stats'

function register (bot) {
  ping.register(bot)
  stats.register(bot)
}

export default {
  categoryName: 'Misc',
  register
}
