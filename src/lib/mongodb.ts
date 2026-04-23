import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI!

let client: MongoClient
let clientPromise: Promise<MongoClient>

const mongoOptions = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  family: 4,
} as const

declare global {
  var _mongoClientPromise: Promise<MongoClient>
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, mongoOptions)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, mongoOptions)
  clientPromise = client.connect()
}

export default clientPromise