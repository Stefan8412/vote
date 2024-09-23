import { Client, Databases } from "appwrite";

const client = new Client();
const DB_ID = "66f0fb81003a34a6c50d";
const COLLECTION_ID = "66f0fb8b00386a23dde8";

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66f0f9a4000ca8ced3ad");

export const databases = new Databases(client);

export { client, DB_ID, COLLECTION_ID };
