import InspiroCmd from './inspiro'
import CatCmd from './cat'
import DogCmd from './dog'
import DeathBulgeCmd from './deathbulge'

const cmds = []

function register (bot) {
  cmds.push(new InspiroCmd(bot))
  cmds.push(new CatCmd(bot))
  cmds.push(new DogCmd(bot))
  cmds.push(new DeathBulgeCmd(bot))

  cmds.forEach((cmd) => cmd.register())
}

export default {
  categoryName: 'Images',
  register,
  cmds
}
