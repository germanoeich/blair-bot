import ping from './ping'
import pokedex from './pokedex'
import dice from './dice'
import inspiro from './inspiro'
import cat from './cat'

export function registerCommands (bot) {
  ping.register(bot)
  pokedex.register(bot)
  dice.register(bot)
  inspiro.register(bot)
  cat.register(bot)
}
