import { PlayerManager } from 'eris-lavalink'
import fetch from 'node-fetch'
// We have only a single instance, when we add more,
// this will have to change (or not /shrug)
let node

export async function getPlayer (msg) {
  const channel = msg.channel.guild.channels.get(msg.member.voiceState.channelID)
  const client = msg._client

  let player = client.voiceConnections.get(channel.guild.id)
  console.log(player)
  if (player && player.channelId === channel.id) {
    return player
  } else if (player) {
    player.stop()
    player.switchChannel(channel.id)
  }

  let options = {}
  if (channel.guild.region) {
    options.region = channel.guild.region
  }

  return client.voiceConnections.join(channel.guild.id, channel.id, options)
}

export async function resolveTracks (search) {
  try {
    console.log('trying to fetch')
    var result = await fetch(`http://${node.host}:2332/loadtracks?identifier=${search}`, {
      headers: {
        'Authorization': node.password,
        'Accept': 'application/json'
      }
    })
    result = await result.json()
    console.log(result)
  } catch (err) {
    throw err
  }

  if (!result) {
    throw new Error('Unable to play that video.')
  }
  // console.log(result)
  return result // array of tracks resolved from lavalink
}

export function initPlayer (bot, hosts) {
  node = hosts[0]
  if (!(bot.voiceConnections instanceof PlayerManager)) {
    bot.voiceConnections = new PlayerManager(bot, hosts, {
      numShards: bot.options.maxShards, // number of shards
      userId: bot.user.id, // the user id of the bot
      defaultRegion: 'us'
    })
  }
}

export default {
  initPlayer,
  resolveTracks,
  getPlayer
}
