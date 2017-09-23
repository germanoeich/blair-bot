class KeyCache {
  constructor (hoursToLive) {
    this.keysCached = {}
    this.cachedValues = {}
    this.ttl = hoursToLive
  }

  isCached (key) {
    return this.keysCached[key] !== undefined
  }

  add (key, value) {
    this.cachedValues[key] = { value, timeAdded: new Date() }
    this.keysCached[key] = true

    return value
  }

  push (key, value) {
    this.cachedValues[key].push(value)
  }

  retrieve (key) {
    if (this.isCached(key)) {
      var cacheEntry = this.cachedValues[key]

      if (this.ttl > 0 && (cacheEntry.timeAdded.getTime() + (this.ttl * 60 * 60 * 1000)) > new Date().getTime()) {
        return cacheEntry.value
      }
    }
    return undefined
  }
}

// Class used to store an entity which has 2 queryable identifiers (like and id and an name)
class TwinKeyCache {
  constructor (hoursToLive) {
    this.keys1Cached = {}
    this.keys2Cached = {}
    this.cachedValues = {}
    this.ttl = hoursToLive
  }

  // Checks the cache and returns an id if we have it
  isCached (key) {
    return this.keys1Cached[key] || this.keys2Cached[key]
  }

  retrieve (key) {
    const cacheId = this.isCached(key)
    if (cacheId) {
      var cacheEntry = this.cachedValues[cacheId]

      if (this.ttl > 0 && (cacheEntry.timeAdded.getTime() + (this.ttl * 60 * 60 * 1000)) > new Date().getTime()) {
        return cacheEntry.pokeInfo
      }
    }
    return undefined
  }

  add (key1, key2, value) {
    this.cachedValues[key1] = { value, timeAdded: new Date() }

    // Store the ID which will be used to retrieve from the cache
    this.keys1Cached[key1] = key1
    this.keys2Cached[key2] = key1

    return value
  }
}

export { KeyCache, TwinKeyCache }
