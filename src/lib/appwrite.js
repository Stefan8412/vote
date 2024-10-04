import { Client, Databases, Account } from "appwrite";

const client = new Client();
const DB_ID = "66f0fb81003a34a6c50d";
const COLLECTION_ID = "66f0fb8b00386a23dde8";
const COLLECTION_ID1 = "66fcdeb3002a4ff8016b";

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66f0f9a4000ca8ced3ad");

export const databases = new Databases(client);

export const account = new Account(client);

export { client, DB_ID, COLLECTION_ID, COLLECTION_ID1 };
