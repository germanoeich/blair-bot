import ping from './ping'
import pokedex from './pokedex'
import dice from './dice'
import inspiro from './inspiro'

export function registerCommands (bot) {
  ping.register(bot)
  pokedex.register(bot)
  dice.register(bot)
  inspiro.register(bot)
}
