import pokedex from './pokemon'
import dice from './dice'
import inspiro from './inspiro'
import cat from './cat'

function register (bot) {
  pokedex.register(bot)
  dice.register(bot)
  inspiro.register(bot)
  cat.register(bot)
}

export default {
  categoryName: 'Fun',
  register
}
