import { useState, useEffect } from "react";
import { Client, Account } from "appwrite";
import Vote from "../components/Vote";

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("66f0f9a4000ca8ced3ad"); // Your project ID

const voters = {
  "66f30fab0027056be9ff": { population: 53203 },
  /*   Lucia: { population: 53203 },
  Lubica: { population: 19483 },
  Jan: { population: 31132 },
  Vladimir: { population: 79305 },
  Vladislav: { population: 75561 },
  Viliam: { population: 58560 },
  Michal: { population: 15319 },
  Jan: { population: 10646 }, */
  "66f5c34b002a60d77af9": { population: 126400 },
  /*   Frantisek: { population: 92759 },
  Michal: { population: 61913 },
  Jozef: { population: 33964 },
  Martina: { population: 82025 },
  Jan: { population: 179 },
  Julia: { population: 3743 },
  PavolP: { population: 13907 },
  Anton: { population: 48640 },
  Jozef: { population: 2399 }, */
  // Add more user IDs and their populations
};

const totalPopulation = Object.values(voters).reduce(
  (acc, voter) => acc + voter.population,
  0
);

const VotingComponent = () => {
  const [votes, setVotes] = useState({});
  const [result, setResult] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const account = new Account(client);
    account
      .get()
      .then((user) => {
        setCurrentUserId(user.$id);
      })
      .catch((error) => {
        console.error("User not authenticated:", error);
        // Redirect to login or handle unauthenticated state
      });
  }, []);

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

  //   const handleSubmit = () => {

  /*  const votingResult = isVotingSuccessful(votes);
        setResult(votingResult ? "Voting success!" : "Voting not successful."); */
  /*  } */
  //   };

  useEffect(() => {
    const votingResult = isVotingSuccessful(votes);
    setResult(votingResult ? "Voting success!" : "Voting not successful.");
  }, [votes]);

  const getVoteData = (vote) => {
    const totalVotes = Object.values(votes).filter((v) => v === vote).length;
    const percentage = totalVotes
      ? (totalVotes / Object.keys(voters).length) * 100
      : 0;
    return { percentage, totalVotes };
  };

  return (
    <div>
      <h1>Voting System</h1>
      <Vote text="For" {...getVoteData("for")} onVote={handleVote} />
      <Vote text="Against" {...getVoteData("against")} onVote={handleVote} />
      {/* <button onClick={handleSubmit}>Submit Votes</button> */}
      {result && <p>{result}</p>}
    </div>
  );
};

export default VotingComponent;
