/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  databases,
  DB_ID,
  COLLECTION_ID1,
  COLLECTION_ID2,
  account,
} from "../lib/appwrite";

import Vote from "./Vote-W";

export default function Questionweight({ data }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [votes, setVotes] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const [userupdated, setUserUpdated] = useState(null);
  const [userId, setUserId] = useState("");
  const [result, setResult] = useState(null); // For population-based result
  const [result2, setResult2] = useState(null); // For special user result
  const [voteSuccess, setVoteSuccess] = useState(null); // Final combined result

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

  const voterspecial = {
    "670f5b5a000d36d03d2c": { population: 0 },
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get(); // Fetch the user data
        setUserEmail(user.email); // Set the user email
        //const userId = user.$id;
        setUserId(user.$id);
        if (voters[userId]) {
          setUserUpdated({
            ...userupdated,
            population: voters[userId].population,
          });
        } // Store matched user with population data
        console.log(userupdated, "object");
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // Simulate calculating the result
  useEffect(() => {
    if (Object.keys(votes).length > 0) {
      const populationResult = isVotingSuccessful(votes); // Population-based result
      const specialUserResult = isVotingSuccessfulspec(votes); // Special user result

      setResult(populationResult);
      setResult2(specialUserResult);

      // Combine both results to determine final voting success
      setVoteSuccess(populationResult && specialUserResult);
      console.log(votes, "dfjh"); // Check the updated votes object here
    }
  }, [votes]);

  useEffect(() => {
    const fetchUserAndVotes = async () => {
      try {
        const user = await account.get(); // Fetch the user data
        setUserEmail(user.email);
        setUserId(user.$id);

        // Fetch all previous votes from Appwrite
        const voteDocuments = await databases.listDocuments(
          DB_ID,
          COLLECTION_ID1
        );
        console.log(voteDocuments, "votedocument");
        const fetchedVotes = voteDocuments.documents.reduce((acc, doc) => {
          acc[doc.userId] = doc.vote; // Assuming vote is stored under `vote` key in Appwrite
          return acc;
        }, {});

        // Set the previously stored votes in state
        setVotes(fetchedVotes);
        console.log(fetchedVotes, "Fetched votes");
      } catch (error) {
        console.error("Error fetching user or votes:", error);
      }
    };

    fetchUserAndVotes();
  }, []);

  // Function to calculate total population from users who voted
  function calculateTotalPopulationFromVotes(votes) {
    return Object.keys(votes).reduce((total, voter) => {
      if (votes[voter] && voters[voter]) {
        return total + voters[voter].population;
      }
      return total;
    }, 0);
  }

  const isVotingSuccessfulspec = (votes) => {
    let specialUserVotedYes = false;
    for (const voterspec of Object.keys(voterspecial)) {
      if (voterspec === "670f5b5a000d36d03d2c") {
        console.log(voterspec, "voterspecial");
        if (votes[voterspec] === "YES") {
          specialUserVotedYes = true;
        }
      }
    }
    return specialUserVotedYes;
  };

  const isVotingSuccessful = (votes) => {
    let totalWeight = 0;
    let agreedWeight = 0;
    let votedCount = 0;
    // const specialUserId = "670f5b5a000d36d03d2c";
    // let specialUserVotedYes = false;

    // Calculate total population only from those who voted
    const totalPopulation = calculateTotalPopulationFromVotes(votes);
    console.log(totalPopulation, votes, "votes");
    for (const voter of Object.keys(voters)) {
      if (votes[voter]) {
        const weight = (voters[voter].population / totalPopulation) * 100;
        totalWeight += weight;
        votedCount++;

        if (votes[voter] === "YES") {
          agreedWeight += weight;
        }
      }
    }

    const agreementThreshold = votedCount * 0.5;
    const successThreshold = totalWeight * 0.51;
    console.log(agreementThreshold, "agreementThreshold");
    const populationVoteSuccessful =
      agreedWeight >= successThreshold &&
      agreedWeight > 0 &&
      votedCount >= agreementThreshold;
    const result = populationVoteSuccessful;
    console.log(populationVoteSuccessful, "result");
    return result;
  };

  /*  const getVoteData = (vote) => {
    const totalVotes = Object.values(votes).filter((v) => v === vote).length;
    const percentage = totalVotes
      ? (totalVotes / Object.values(votes).length) * 100
      : 0;
    return { percentage, totalVotes };
  }; */

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const selectedVote = formData.get("vote");
    //data.$id=document
    if (selectedVote === data.odpoved_1) {
      databases.updateDocument(DB_ID, COLLECTION_ID2, data.$id, {
        hlasy_1: data.hlasy_1 + 1,
      });
      databases.createDocument(DB_ID, COLLECTION_ID1, "unique()", {
        userId: userId, // Store the user ID along with the vote
        vote: "YES",
      });
      setVotes((prevVotes) => ({ ...prevVotes, [userId]: "YES" }));
    }

    // eslint-disable-next-line react/prop-types
    else if (selectedVote === data.odpoved_2) {
      databases.updateDocument(DB_ID, COLLECTION_ID2, data.$id, {
        hlasy_2: data.hlasy_2 + 1,
      });
      databases.createDocument(DB_ID, COLLECTION_ID1, "unique()", {
        userId: userId, // Store the user ID along with the vote
        vote: "NO",
      });
      setVotes((prevVotes) => ({ ...prevVotes, [userId]: "NO" }));
    } else if (selectedVote === data.odpoved_3) {
      databases.updateDocument(DB_ID, COLLECTION_ID2, data.$id, {
        hlasy_3: data.hlasy_3 + 1,
      });
      databases.createDocument(DB_ID, COLLECTION_ID1, "unique()", {
        userId: userId, // Store the user ID along with the vote
        vote: "abstain",
      });
      setVotes((prevVotes) => ({ ...prevVotes, [userId]: "abstain" }));
    }

    setIsSubmitted(true);
  }

  return (
    <div>
      {userId ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 votes-container"
        >
          <Vote
            text={data.odpoved_1}
            // percentage={Math.floor((data.hlasy_1 / totalPopulation) * 100)}
            votes={data.hlasy_1}
            //  percentage={getVoteData("YES").percentage}
          />

          <Vote
            text={data.odpoved_2}
            // percentage={Math.floor((data.hlasy_1 / totalPopulation) * 100)}
            votes={data.hlasy_2}
            //  percentage={getVoteData("NO").percentage}
          />
          <Vote
            text={data.odpoved_3}
            // percentage={Math.floor((data.hlasy_1 / totalPopulation) * 100)}
            votes={data.hlasy_3}
            //   percentage={getVoteData("abstain").percentage}
          />

          <button
            type="submit"
            disabled={isSubmitted}
            className="cursor-pointer ml-auto my-6 rounded shadow bg-green-400 text-white font-medium text-lg py-2 px-10 transition hover:bg-white hover:text-green-400 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-100"
          >
            Vote
          </button>
          {/* Display the combined result */}
          {voteSuccess !== null && (voteSuccess ? "Approved" : "Not Approved")}
        </form>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
