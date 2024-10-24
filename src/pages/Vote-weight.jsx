import { useState, useEffect } from "react";
import Questionweight from "../components/Question-weight";

import { client, databases, DB_ID, COLLECTION_ID2 } from "../lib/appwrite";

const Voteweight = () => {
  const [votes, setVotes] = useState({});
  const [result, setResult] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getQuestionsFromDB();

    const unsubscribe = client.subscribe(
      `databases.${DB_ID}.collections.${COLLECTION_ID2}.documents`,
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
    const questions = await databases.listDocuments(DB_ID, COLLECTION_ID2);
    setQuestions(questions.documents);
  }
  const handleQuestionChange = (e) => {
    setSelectedQuestionId(e.target.value);
    updateSelectedQuestion(e.target.value); // Admin selects a question
  };

  const updateSelectedQuestion = async (questionId) => {
    const selectedQuestion = questions.find((q) => q.$id === questionId);
    console.log(selectedQuestion, "trafena");
    if (selectedQuestion) {
      await databases.updateDocument(
        DB_ID,
        COLLECTION_ID2,
        selectedQuestion.$id,
        {
          selected: true, // Set a flag to mark it as selected
        }
      );
    }
  };
  const selectedQuestion = questions.find((q) => q.$id === selectedQuestionId);
  return (
    <main className="container max-w-3xl mx-auto px-4 py-10">
      <select value={selectedQuestionId || ""} onChange={handleQuestionChange}>
        <option value="">Zvoľte hlasovanie</option>
        {questions.map((question) => (
          <option key={question.$id} value={question.$id}>
            {question.text}
          </option>
        ))}
      </select>
      {selectedQuestion && (
        <Questionweight key={selectedQuestion.$id} data={selectedQuestion} />
      )}
      {result}
    </main>
  );
};

export default Voteweight;
