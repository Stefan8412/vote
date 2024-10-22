import { useState, useEffect } from "react";
import {
  client,
  databases,
  DB_ID,
  COLLECTION_ID,
  account,
} from "../lib/appwrite";
import Question from "../components/Question";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Admin check

  useEffect(() => {
    checkIfAdmin();
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
  const checkIfAdmin = async () => {
    const user = await account.get();
    // Implement your admin check logic here
    if (user.email === "stefan@hancar.sk") {
      setIsAdmin(true); // Replace with your actual logic
    }
  };

  async function getQuestionsFromDB() {
    const questions = await databases.listDocuments(DB_ID, COLLECTION_ID);
    console.log(questions, "blabla");
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
        COLLECTION_ID,
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
        <option value="">Select a question</option>
        {questions.map((question) => (
          <option key={question.$id} value={question.$id}>
            {question.text}
          </option>
        ))}
      </select>

      {selectedQuestion && (
        <Question key={selectedQuestion.$id} data={selectedQuestion} />
      )}
    </main>
  );
};

export default Home;
