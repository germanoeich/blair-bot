import ping from './ping'
import pokedex from './pokemon'
import dice from './dice'
import inspiro from './inspiro'
import cat from './cat'
import kick from './kick'

export function registerCommands (bot) {
  ping.register(bot)
  pokedex.register(bot)
  dice.register(bot)
  inspiro.register(bot)
  cat.register(bot)
  kick.register(bot)
}