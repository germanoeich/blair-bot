import ping from './ping'
import pokedex from './pokedex'

export function registerCommands (bot) {
  ping.register(bot)
  pokedex.register(bot)
}
