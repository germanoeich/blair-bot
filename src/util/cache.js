// The general idea is to be able to quickly determinate if an entity is cached in memory
// by using obj["key"]. If it is, the value will be the ID of the pokemon and we can retrieve it
// using the same idea on the cache list. This way we can quickly check the cache and return the entity
// without the need to loop

// Contains the IDs of the pokemon that are cached
const idsCached = {}
// Contains the names of the pokemon that are cached
const namesCached = {}

// Actual Pokemon cache
const pokemonCache = {}

// Checks the cache and returns an id if we have it
export function isCached (pokemonIdOrName) {
  return namesCached[pokemonIdOrName] || idsCached[pokemonIdOrName]
}

export function retrieve (pokemonIdOrName) {
  var cacheId = isCached(pokemonIdOrName)
  if (cacheId) {
    var cacheEntry = pokemonCache[cacheId]

    // Cache will persist for 12 hours
    if ((cacheEntry.timeAdded.getTime() + (12 * 60 * 60 * 1000)) > new Date().getTime()) {
      return cacheEntry.pokeInfo
    }
  }
  return undefined
}

export function add (pokemonInfo) {
  pokemonCache[pokemonInfo.id] = { pokeInfo: pokemonInfo, timeAdded: new Date() }

  // Store the ID which will be used to retrieve from the cache
  namesCached[pokemonInfo.name] = pokemonInfo.id
  idsCached[pokemonInfo.id] = pokemonInfo.id

  return pokemonInfo
}

export default {
  isCached,
  add,
  retrieve
}
