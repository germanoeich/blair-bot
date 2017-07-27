import { MongoClient } from 'mongodb'
import config from './../config'

export async function cache () {
  const conn = await MongoClient.connect(config.db.url)
  return conn.collection('cache')
}
