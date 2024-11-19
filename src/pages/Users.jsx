import {
  client,
  account,
  COLLECTION_ID4,
  databases,
  DB_ID,
} from "../lib/appwrite";
import { useState, useEffect } from "react";

const UserCounter = () => {
  const [connectedUsers, setConnectedUsers] = useState([]);

  const fetchActiveUsers = async () => {
    try {
      // Fetch all active users from the collection
      const response = await databases.listDocuments(DB_ID, COLLECTION_ID4);
      setConnectedUsers(response.documents);
    } catch (error) {
      console.error("Failed to fetch active users:", error);
    }
  };

  const addUserToCollection = async (user) => {
    try {
      await databases.createDocument(DB_ID, COLLECTION_ID4, user.$id, {
        userId: user.$id,
        name: user.name,
        email: user.email,
      });
      fetchActiveUsers();
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const removeUserFromCollection = async (userId) => {
    try {
      await databases.deleteDocument(DB_ID, COLLECTION_ID4, userId);
      fetchActiveUsers();
    } catch (error) {
      console.error("Failed to remove user:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = client.subscribe("session", async (res) => {
      console.log(res, "res");
      if (res.events.includes("session.create")) {
        try {
          const user = await account.get();
          await addUserToCollection(user);
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      } else if (res.events.includes("session.delete")) {
        const userId = res.payload.$id;
        await removeUserFromCollection(userId);
      }
    });

    fetchActiveUsers(); // Initial fetch of active users

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h2>Active Users: {connectedUsers.length}</h2>
      <ul>
        {connectedUsers.map((user) => (
          <li key={user.$id}>{user.name || user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserCounter;
