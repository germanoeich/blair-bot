import ping from './ping'
import pokedex from './pokedex'

const cmdList = []

// Add new CMDs here
cmdList.push(ping)
cmdList.push(pokedex)

export function dispatchMsg (msg, bot) {
  cmdList.forEach(function (cmd) {
    cmd.action(msg, bot)
  }, this)
}
