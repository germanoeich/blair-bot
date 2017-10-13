import FetchCommand from './../fetchCommand'

export default class CatFactsCmd extends FetchCommand {
  constructor (bot) {
    const info = {
      name: 'catfacts',
      usage: 'catfacts',
      description: 'Shows a random Cat Fact',
      fullDescription: 'Shows a random Cat Fact',
      aliases: ['catfact'],
      fetchInfo: {
        url: 'https://catfact.ninja/fact',
        resolveReturn: async (response) => `**Cat Fact:** ${(await response.json()).fact}`
      }
    }
    super(info, bot)
  }
}
