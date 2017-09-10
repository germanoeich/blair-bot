const info = {
  name: 'help',
  description: 'shows help'
}

function register (bot, arr) {
  let helpStr = '```Haskell\nhelp\n"shows help"\n"<> = required, [] = optional"\n\n'
  arr.forEach((cmd) => {
    const { info } = cmd
    let aliasStr = (info.alias) ? ` -- alias: ${info.alias}` : ''
    let argsStr = (info.args) ? `${info.args}` : ''
    helpStr += `${info.name} ${argsStr} ${aliasStr}\n`
    helpStr += `"${info.description}"\n\n`
  })
  helpStr += '```'

  bot.registerCommand(info.name, helpStr, info)
}

export default {
  info,
  register
}
