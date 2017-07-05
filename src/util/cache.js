// The general idea is to be able to quickly determinate if an entity is cached in memory
// by using obj["key"]. If it is, we will loop through the main array to retrieve it. But
// if it isn't, we can move on without iterating through many entities.
// Contains the IDs of the pokemon that are cached
const idsCached = {}
// Contains the names of the pokemon that are cached
const namesCached = {}

const pokemonCache = []

export function isCached (pokemonIdOrName) {
  return namesCached[pokemonIdOrName] || idsCached[pokemonIdOrName]
}

export function retrieve (pokemonIdOrName) {
  if (isCached(pokemonIdOrName)) {
    var ret
    pokemonCache.some(function (p) {
      if (p.id == pokemonIdOrName || p.name === pokemonIdOrName) { // eslint-disable-line
        ret = p
        // some will break out of the loop if some (any) condition is true
        return true
      }
      // to continue the loop
      return false
    }, this)
    return ret
  }
  return undefined
}

export function add (pokemonInfo) {
  if (!namesCached[pokemonInfo.name] || !idsCached[pokemonInfo.id]) {
    pokemonCache.push(pokemonInfo)

    // Values don't really matter
    namesCached[pokemonInfo.name] = 1
    idsCached[pokemonInfo.id] = 1
  }

  return pokemonInfo
}

export default {
  isCached,
  add,
  retrieve
}
