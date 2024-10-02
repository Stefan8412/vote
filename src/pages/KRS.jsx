import { useState, useEffect } from "react";
import Question1 from "../components/Question1";

import { client, databases, DB_ID, COLLECTION_ID } from "../lib/appwrite";

const VotingComponent = () => {
  const [votes, setVotes] = useState({});
  const [result, setResult] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState("");
  /* 
  useEffect(() => {
    async function getCurrentUser() {
      const userId = await getCurrentUser();
      console.log(userId);
      setCurrentUserId(currentUserId);
      console.log(currentUserId, "currentUserId");
    }
    getCurrentUser();
  }, []); */

  /* useEffect(() => {
  
 
    account
      .get()
      .then((user) => {
        setCurrentUserId(user.$id);
      })
      .catch((error) => {
        console.error("User not authenticated:", error);
        // Redirect to login or handle unauthenticated state
      });
  }, []); */

  const isVotingSuccessful = (votes) => {
    let totalWeight = 0;
    let agreedWeight = 0;
    let votedCount = 0;

    for (const voter of Object.keys(voters)) {
      if (votes[voter]) {
        const weight = (voters[voter].population / totalPopulation) * 100;
        totalWeight += weight;
        votedCount++;

        if (votes[voter] === "for") {
          agreedWeight += weight;
        }
      }
    }

    const agreementThreshold = votedCount * 0.5;
    const successThreshold = totalWeight * 0.51;

    return (
      agreedWeight >= successThreshold &&
      agreedWeight > 0 &&
      votedCount >= agreementThreshold
    );
  };

  const handleVote = (vote) => {
    setVotes((prevVotes) => ({ ...prevVotes, [currentUserId]: vote }));
  };

  const handleSubmit = () => {
    const votingResult = isVotingSuccessful(votes);
    setResult(votingResult ? "Voting success!" : "Voting not successful.");
  };

  const getVoteData = (vote) => {
    const totalVotes = Object.values(votes).filter((v) => v === vote).length;
    const percentage = totalVotes
      ? (totalVotes / Object.keys(voters).length) * 100
      : 0;
    return { percentage, totalVotes };
  };

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
