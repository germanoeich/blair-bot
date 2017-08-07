import ping from './ping'
import pokedex from './pokemon'
import dice from './dice'
import inspiro from './inspiro'
import cat from './cat'
import kick from './kick'
import help from './help'

export function registerCommands () {
  ping.register()
  pokedex.register()
  dice.register()
  inspiro.register()
  cat.register()
  kick.register()

  help.register([ping, pokedex, dice, inspiro, cat, kick])
}
