import exclusive from './exclusive'
import fun from './fun'
import misc from './misc'
import moderation from './moderation'
import music from './music'
// import help from './help'

export function registerCommands (bot) {
  exclusive.register(bot)
  fun.register(bot)
  misc.register(bot)
  moderation.register(bot)
  music.register(bot)

  // help.register(bot, [ping, pokedex, dice, inspiro, cat, kick, role])
}
