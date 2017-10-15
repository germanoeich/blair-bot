// import PokemonCmd from './pokemon'
import DiceCmd from './dice'
import CatFactsCmd from './catfacts'

const cmds = []

function register (bot) {
  // cmds.push(new PokemonCmd(bot))
  cmds.push(new DiceCmd(bot))
  cmds.push(new CatFactsCmd(bot))

  cmds.forEach((cmd) => cmd.register())
}

export default {
  categoryName: 'Fun',
  register,
  cmds
}
