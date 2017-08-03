// import { bot } from './../index.js'
import Responder from './../messages/responder.js'

class TargetSelector {
  async find (msg, name) {
    return new Promise(async function (resolve, reject) {
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
        resolve(undefined)
        return
      }

      if (probableMatches.length === 1) {
        resolve(probableMatches[0].member)
        return
      }

      try {
        const responder = new Responder(msg.channel)

        let options = ''
        probableMatches.forEach((value, index) => {
          const alias = (value.member.nick) ? ` (AKA: ${value.member.nick})` : ''
          options += `[${index}] ${value.member.username}${alias}\n`
        })

        console.log(options)

        await responder
        .bold('Multiple matches, please choose one by typing the number displayed beside the user (you have 60 seconds and 3 tries):')
        .newline()
        .code(options, 'Haskell')
        .send()

        var response = await responder.waitSingle(msg)
        resolve(probableMatches[response.content].member.user)
      } catch (err) {
        console.error(err)
      }
    })
  }
}

export default TargetSelector
