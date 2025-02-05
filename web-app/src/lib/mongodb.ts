import { MongoClient, ServerApiVersion, Db } from "mongodb";

const uri: string = process.env.MONGODB_URI || "";

if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env file");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// ✅ Use `globalThis` instead of `var` for better TypeScript safety
const globalForMongo = globalThis as unknown as { _mongoClientPromise?: Promise<MongoClient> };

// ✅ In development, reuse existing connection to prevent re-creating on every HMR refresh
if (process.env.NODE_ENV === "development") {
  if (!globalForMongo._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    globalForMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalForMongo._mongoClientPromise;
} else {
  // ✅ In production, create a new client
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  clientPromise = client.connect();
}

// ✅ Export a fully typed database connection
export const database: Promise<Db> = clientPromise.then((client) => client.db("test"));
