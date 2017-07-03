import ping from './ping'

const cmdList = []

// Add new CMDs here
cmdList.push(ping)

export function dispatchMsg (msg, bot) {
  cmdList.forEach(function (cmd) {
    cmd.action(msg, bot)
  }, this)
}
