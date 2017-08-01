// import { bot } from './../index.js'
import Responder from './../messages/responder.js'

class TargetSelector {
  async find (msg, name) {
    console.log('find')
    const probableMatches = msg.channel.guild.members.filter((member) => !member.bot).map((member) => {
      if (member.mention === name) {
        return { member, order: 0 }
      }

      if (member.username.toLowerCase().includes(name.toLowerCase())) {
        return { member, order: 1 }
      }
    })
    .filter((member) => member)

    if (probableMatches.length === 0) {
      console.log('found none')
      Promise.resolve(undefined)
    }

    if (probableMatches.length === 1 && probableMatches[0].order === 0) {
      console.log('found one only')
      Promise.resolve(probableMatches[0].member)
    }

    console.log('found multiple')
    console.log(probableMatches)

    try {
      const responder = new Responder(msg.channel)
      const options = probableMatches.reduce((accumulator, value, index) => {
        return `[${index}] ${value.member.username} ${value.member.nick && `(AKA: ${value.member.nick})`}\n`
      })

      await responder
      .bold('Multiple matches, please choose one by typing the number displayed beside the user (you have 60 seconds and 3 tries):')
      .newline()
      .code(options)
      .send()

      const resolve = Promise.resolve
      const reject = Promise.reject

      let tryCount = 0
      const repeatFunc = (response) => {
        if (probableMatches[response.content]) {
          resolve(probableMatches[response.content])
        } else {
          if (tryCount > 3) {
            reject() // eslint-disable-line
          }
          responder.waitSingle(repeatFunc, 60)
          tryCount++
        }
      }

      responder.waitSingle(repeatFunc, 60)
    } catch (err) { console.error(err) }
  }
}

export default TargetSelector
