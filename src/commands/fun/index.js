import PokemonCmd from './pokemon'
import DiceCmd from './dice'
import InspiroCmd from './inspiro'
import CatCmd from './cat'
import DogCmd from './dog'
import CatFactsCmd from './catfacts'
import DeathBulgeCmd from './deathbulge'

const cmds = []

function register (bot) {
  cmds.push(new PokemonCmd(bot))
  cmds.push(new DiceCmd(bot))
  cmds.push(new InspiroCmd(bot))
  cmds.push(new CatCmd(bot))
  cmds.push(new DogCmd(bot))
  cmds.push(new CatFactsCmd(bot))
  cmds.push(new DeathBulgeCmd(bot))

  cmds.forEach((cmd) => cmd.register())
}

export default {
  categoryName: 'Fun',
  register,
  cmds
}
