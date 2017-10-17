import fetch from 'node-fetch'

export default class Weebsh {
  constructor (token) {
    this.token = token
    this.baseUrl = 'https://api.weeb.sh'
    this.headers = {
      'Authorization': `Wolke ${this.token}`,
      'Content-Type': 'application/json'
    }
  }

  async getTypes (nsfw = true) {
    const response = await fetch(`${this.baseUrl}/images/types?nsfw=${nsfw || false}`, {
      headers: this.headers
    })
    const ret = await response.json()
    return ret.types
  }

  async getRandom (type, nsfw) {
    let params = `?type=${type}&nsfw=${nsfw || false}`
    const response = await fetch(`${this.baseUrl}/images/random${params}`, {
      headers: this.headers
    })
    const ret = await response.json()
    return ret.url
  }
}
