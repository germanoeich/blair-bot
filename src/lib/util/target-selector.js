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

      const responder = new Responder(msg.channel)

      let options = ''
      probableMatches.forEach((value, index) => {
        const alias = (value.member.nick) ? `(AKA: ${value.member.nick})` : ''
        options += `[${index}] ${value.member.username}#${value.member.discriminator} ${alias}\n`
      })

      await responder
      .bold('Multiple matches, please choose one (or type cancel):')
      .newline()
      .code(options, 'Haskell')
      .send()

      try {
        let selectedMatch
        do {
          const response = await responder.waitSingle(msg)

          if (response.content === 'cancel') {
            break
          }

          if (!Number.isNaN(parseInt(response.content))) {
            selectedMatch = probableMatches[response.content]
            if (selectedMatch) {
              resolve(selectedMatch.member.user)
              break
            }
          }

          await responder
          .error('Invalid input, please try again')
          .send()
        } while (true)
      } catch (err) {
        if (err.message === 'timeout') {
          await responder
          .error('Prompt cancelled because of inactivity')
          .send()

          resolve(undefined)
        }

        console.error(err)
        reject(err)
      }
    })
  }
}

export default TargetSelector
