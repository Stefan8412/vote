import { Client, Databases, Account, Query } from "appwrite";

const client = new Client();
const DB_ID = "66f0fb81003a34a6c50d";
const COLLECTION_ID = "66f0fb8b00386a23dde8";
const COLLECTION_ID1 = "66fcdeb3002a4ff8016b";
const COLLECTION_ID2 = "6704281300250441d398";
const COLLECTION_ID3 = "67042936001d1d7b7a71";
const COLLECTION_ID4 = "673ae06e00152a243cc2";
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66f0f9a4000ca8ced3ad");

export const databases = new Databases(client);

export const account = new Account(client);

export {
  client,
  DB_ID,
  COLLECTION_ID,
  COLLECTION_ID1,
  COLLECTION_ID2,
  COLLECTION_ID3,
  COLLECTION_ID4,
  Query,
};
