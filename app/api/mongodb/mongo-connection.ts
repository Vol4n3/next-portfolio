import { Db, MongoClient } from "mongodb";

let instance: MongoClient;
export const dbName = "portfolio";
export const articleCollectionName = "articles";
export const projectCollectionName = "projects";
const createIndexes = async (db: Db) => {
  await db
    .createCollection(articleCollectionName)
    .catch(() => console.info("articles collection already exists"));
  const articles = db.collection(articleCollectionName);
  await articles.createIndex({ id: 1 }, { unique: true });
  await articles.createIndex(
    { title: "text", content: "text", description: "text" },
    {
      weights: {
        title: 3,
        description: 2,
        content: 1,
      },
    },
  );
  await db
    .createCollection(projectCollectionName)
    .catch(() => console.info("projects collection already exists"));
};
const getConnection = async () => {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  console.info("connection to database ...");
  await client.connect();
  console.info("connection to database successfully");
  await createIndexes(client.db(dbName));
  return client;
};
export const mongoConnection = async <T>(
  instructions: (db: Db) => Promise<T>,
): Promise<T> => {
  if (!instance) {
    instance = await getConnection();
  } else {
    try {
      await instance.db("admin").command({ ping: 1 });
      console.info("database still alive");
    } catch (e) {
      console.info("connection was loose , try to reconnect ...");
      instance = await getConnection();
    }
  }
  return instructions(instance.db(dbName));
};
