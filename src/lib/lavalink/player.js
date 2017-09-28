import { PlayerManager } from 'eris-lavalink'
import fetch from 'node-fetch'
import Raven from 'raven'

// We have only a single instance, when we add more,
// this will have to change (or not /shrug)
let node

export async function searchTracks (search, ytsearch = false) {
  search = ytsearch ? `ytsearch:${search}` : search
  try {
    var result = await fetch(`http://${node.host}:2333/loadtracks?identifier=${search}`, {
      headers: {
        'Authorization': node.password,
        'Accept': 'application/json'
      }
    })
    result = await result.json()
  } catch (err) {
    throw err
  }

  if (!result) {
    throw new Error('Unable to play that video.')
  }
  // console.log(result)
  return result // array of tracks resolved from lavalink
}

export async function get (msg, join = false) {
  const voiceChannel = msg.channel.guild.channels.get(msg.member.voiceState.channelID)
  const client = msg._client
  const guildId = voiceChannel.guild.id

  let player = client.voiceConnections.get(guildId)

  if (!join) {
    return player
  }

  if (player) {
    if (player.channelId === voiceChannel.id) {
      return player
    }

    player.stop()
    player.switchChannel(voiceChannel.id)
    return player
  }

  let options = {}
  if (voiceChannel.guild.region) {
    options.region = voiceChannel.guild.region
  }

  return client.voiceConnections.join(guildId, voiceChannel.id, options)
}

export function initPlayer (bot, hosts) {
  node = hosts[0]
  if (!(bot.voiceConnections instanceof PlayerManager)) {
    bot.voiceConnections = new PlayerManager(bot, hosts, {
      numShards: bot.options.maxShards, // number of shards
      userId: bot.user.id, // the user id of the bot
      defaultRegion: 'us'
    })

    bot.voiceConnections.on('error', (err) => {
      console.error('ERROR - Lavalink error raised:\n' + JSON.stringify(err))

      // So we don't generate a unique error on sentry for each track
      err.track = ''
      Raven.captureException(new Error('ERROR - Lavalink error raised:\n' + JSON.stringify(err)))
    })
  }
}

export default {
  get,
  searchTracks
}
