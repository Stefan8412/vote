import { useState, useEffect } from "react";
import Question1 from "../components/Question1";

import { client, databases, DB_ID, COLLECTION_ID } from "../lib/appwrite";

const VotingComponent = () => {
  const [votes, setVotes] = useState({});
  const [result, setResult] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState("");

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getQuestionsFromDB();

    const unsubscribe = client.subscribe(
      `databases.${DB_ID}.collections.${COLLECTION_ID}.documents`,
      (res) => {
        console.log(res, "res");

        if (
          res.events.includes("databases.*.collections.*.documents.*.update")
        ) {
          setQuestions((prevQuestions) => {
            return prevQuestions.map((question) => {
              if (question.$id !== res.payload.$id) {
                return question;
              }

              return res.payload;
            });
          });

          console.log("Updated Question");
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  async function getQuestionsFromDB() {
    const questions = await databases.listDocuments(DB_ID, COLLECTION_ID);
    setQuestions(questions.documents);
  }

  return (
    <main className="container max-w-3xl mx-auto px-4 py-10">
      {questions.map((question) => (
        <Question1 key={question.$id} data={question} />
      ))}
    </main>
  );
};

export default VotingComponent;
