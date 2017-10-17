import InspiroCmd from './inspiro'
import CatCmd from './cat'
import DogCmd from './dog'
import DeathBulgeCmd from './deathbulge'
import WeebShCommandGenerator from './weebsh'

const cmds = []

async function register (bot) {
  cmds.push(new InspiroCmd(bot))
  cmds.push(new CatCmd(bot))
  cmds.push(new DogCmd(bot))
  cmds.push(new DeathBulgeCmd(bot))

  const weebGenerator = new WeebShCommandGenerator(bot)
  await weebGenerator.generateCommands()
  cmds.push(...weebGenerator.typeCmds)

  cmds.forEach((cmd) => cmd.register())
}

export default {
  categoryName: 'Images',
  register,
  cmds
}
