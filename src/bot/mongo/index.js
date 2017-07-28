import { MongoClient } from 'mongodb'
import config from './../config'

export async function prefix () {
  const conn = await MongoClient.connect(config.db.url)
  return conn.collection('prefix')
}
