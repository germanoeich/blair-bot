import exclusive from './exclusive'
import fun from './fun'
import misc from './misc'
import moderation from './moderation'
import music from './music'
import HelpCmd from './help'

export function registerCommands (bot) {
  exclusive.register(bot)
  fun.register(bot)
  misc.register(bot)
  moderation.register(bot)
  music.register(bot)

  var helpCmd = new HelpCmd(bot, [ exclusive, fun, misc, moderation, music ])
  helpCmd.register()

  misc.cmds.push(helpCmd)
}
