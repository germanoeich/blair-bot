import exclusive from './exclusive'
import fun from './fun'
import misc from './misc'
import moderation from './moderation'
import music from './music'
import HelpCmd from './help'

const categories = []

export function registerCommands (bot) {
  categories.push(exclusive, fun, misc, moderation, music)
  exclusive.register(bot)
  fun.register(bot)
  misc.register(bot)
  moderation.register(bot)
  music.register(bot)

  var helpCmd = new HelpCmd(bot, categories)
  helpCmd.register()

  misc.cmds.push(helpCmd)

  bot.cmdCategories = categories
  bot.cmdNames = []
  categories.forEach((cat) => {
    cat.cmds.forEach((cmd) => bot.cmdNames.push(cmd.info.name))
  })
}
