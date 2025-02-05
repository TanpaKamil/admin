import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI || "";

if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env file");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Use a global variable to preserve connection in dev mode (Next.js HMR)
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production, create a new client
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  clientPromise = client.connect();
}

// Export database connection
export const database = clientPromise.then((client) => client.db("test"));
