import Responder from './../messages/responder'
import DeleteQueue from './../messages/deleteQueue'

class TargetSelector {
  async find (msg, arg) {
    return new Promise(async function (resolve, reject) {
      let hashtagArg = arg.startsWith('#') && !Number.isNaN(parseInt(arg.substring(1)))
      let numericArg = !hashtagArg && !Number.isNaN(parseInt(arg))

      const probableMatches = msg.channel.guild.members.map((member) => {
        // This is strange, but the arg will not have the ! even when the user has a nickname
        if (member.mention.replace(/<@!/g, '<@') === arg ||
            member.username.toLowerCase().includes(arg.toLowerCase()) ||
            (member.nick && member.nick.toLowerCase().includes(arg.toLowerCase())) ||
            (numericArg && member.id.startsWith(arg)) ||
            (hashtagArg && ('#' + member.user.discriminator).startsWith(arg))) {
          return member
        }
      })
      .filter((member) => member)

      const responder = new Responder(msg.channel)

      if (probableMatches.length === 0) {
        responder.error('User not found').send()
        resolve(undefined)
        return
      }

      if (probableMatches.length === 1) {
        resolve(probableMatches[0])
        return
      }

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

      const deleteQueue = new DeleteQueue()
      try {
        let selectedMatch
        do {
          const response = await responder.waitSingle(msg)

          if (response.content === 'cancel') {
            await responder.success('Prompt cancelled').ttl(10).send()
            break
          }

          if (!Number.isNaN(parseInt(response.content))) {
            selectedMatch = probableMatches[response.content]
            if (selectedMatch) {
              resolve(selectedMatch)
              break
            }
          }

          deleteQueue.deleteAll()

          deleteQueue.add(await responder
          .invalidInput()
          .send())
        } while (true)

        deleteQueue.deleteAll()
      } catch (err) {
        if (err.message === 'timeout') {
          deleteQueue.deleteAll()

          await responder
          .promptTimeout()
          .ttl(10)
          .send()

          resolve(false)
        } else {
          console.error(err)
          reject(err)
        }
      }
    })
  }
}

export default TargetSelector
