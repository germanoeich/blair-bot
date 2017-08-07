import Responder from './../messages/responder'
import integrity from './../internal/integrity'

class TargetSelector {
  async find (msg, arg) {
    return new Promise(async function (resolve, reject) {
      let hashtagArg = arg.startsWith('#') && !Number.isNaN(parseInt(arg.substring(1)))
      let numericArg = !hashtagArg && !Number.isNaN(parseInt(arg))

      const probableMatches = msg.channel.guild.members.filter((member) => !member.bot).map((member) => {
        if (member.mention.replace('@!', '@') === arg) {
          return member
        }

        if (member.username.toLowerCase().includes(arg.toLowerCase())) {
          return member
        }

        if (numericArg && member.id.startsWith(arg)) {
          return member
        }

        if (hashtagArg && ('#' + member.user.discriminator).startsWith(arg)) {
          return member
        }
      })
      .filter((member) => member)

      if (probableMatches.length === 0) {
        resolve(undefined)
        return
      }

      if (probableMatches.length === 1) {
        resolve(probableMatches[0])
        return
      }

      const responder = new Responder(msg.channel)

      if (!integrity.canPrompt(msg.author)) {
        await responder
        .promptBlocked()
        .send()
        return
      }

      integrity.startPrompt(msg.author)

      let options = ''
      probableMatches.forEach((value, index) => {
        const alias = (value.nick) ? `(AKA: ${value.nick})` : ''
        const id = (numericArg) ? `[${value.id}]` : ''
        options += `[${index}] ${value.username}#${value.discriminator} ${alias} ${id}\n`
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
            await responder.success('Prompt cancelled').send()
            break
          }

          if (!Number.isNaN(parseInt(response.content))) {
            selectedMatch = probableMatches[response.content]
            if (selectedMatch) {
              resolve(selectedMatch)
              break
            }
          }

          await responder
          .invalidInput()
          .send()
        } while (true)
      } catch (err) {
        if (err.message === 'timeout') {
          await responder
          .promptTimeout()
          .send()

          resolve(false)
        } else {
          console.error(err)
          reject(err)
        }
      }
      integrity.endPrompt(msg.author)
    })
  }
}

export default TargetSelector
