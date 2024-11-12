/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  databases,
  DB_ID,
  COLLECTION_ID1,
  COLLECTION_ID2,
  account,
  Query,
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
  const [hasVoted, setHasVoted] = useState(false);

  const voters = {
    "6718900f0032f210b946": { population: 53203 },
    "67188ea6003ca9089150": { population: 19483 },
    "67188f9e001171d1a606": { population: 31132 },
    "67188d8b003d5d24fd39": { population: 79305 },
    "67188f6000257f5eb305": { population: 75561 },
    "67188d030013bd15c23f": { population: 58560 },
    "67188fbd0029df3ef6ac": { population: 15319 },
    "67188ec8002555126f88": { population: 10646 },
    "67188fe40003ca3a30fc": { population: 126400 },

    "67188ef700360836d036": { population: 92759 },
    "67188f3d001891970145": { population: 61913 },
    "67188e750008f8a00cd4": { population: 33964 },
    "6718902e0021c9d89d06": { population: 82025 },
    "671890c1000ed6276d6d": { population: 179 },
    "6718904e003cd2f1dec4": { population: 3743 },
    "6718906e003816179729": { population: 13907 },
    "6718908b001d308d6bd9": { population: 48640 },
    "671890da0025ffd3d5f4": { population: 2399 },
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
        checkIfUserHasVoted(user.email);
        if (voters[userId]) {
          setUserUpdated({
            ...userupdated,
            population: voters[userId].population,
          });
        } // Store matched user with population data
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [data]);
  const checkIfUserHasVoted = async (userEmail) => {
    try {
      console.log("Checking vote status for:", userEmail, data.$id);

      // Ensure userEmail and data.$id are valid
      if (!userEmail || !data?.$id) {
        throw new Error("Missing user email or question ID.");
      }

      // Query the votes collection to check if the user has voted on this question
      const votes = await databases.listDocuments(DB_ID, COLLECTION_ID1, [
        Query.equal("userEmail", [userEmail]), // Wrap value in an array
        Query.equal("questionId", [data.$id]), // Wrap value in an array
      ]);
      console.log("Votes query result:", votes.documents);

      // Check if the user has voted on this question
      if (votes.documents.length > 0) {
        setHasVoted(true); // The user has already voted
        setIsSubmitted(true); // Disable the voting form
      }
    } catch (error) {
      console.error("Error checking vote status:", error);
    }
  };

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

        if (votes[voter] === "ZA") {
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
    if (!hasVoted) {
      if (selectedVote === data.odpoved_1) {
        databases.updateDocument(DB_ID, COLLECTION_ID2, data.$id, {
          hlasy_1: data.hlasy_1 + 1,
        });
        databases.createDocument(DB_ID, COLLECTION_ID1, "unique()", {
          userId: userId, // Store the user ID along with the vote
          vote: "ZA",
          userEmail: userEmail,
          questionId: data.$id,
          question: data.text,
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
          vote: "PROTI",
          userEmail: userEmail,
          questionId: data.$id,
          question: data.text,
        });
        setVotes((prevVotes) => ({ ...prevVotes, [userId]: "NO" }));
      } else if (selectedVote === data.odpoved_3) {
        databases.updateDocument(DB_ID, COLLECTION_ID2, data.$id, {
          hlasy_3: data.hlasy_3 + 1,
        });
        databases.createDocument(DB_ID, COLLECTION_ID1, "unique()", {
          userId: userId, // Store the user ID along with the vote
          vote: "ZDRŽAL SA",
          userEmail: userEmail,
          questionId: data.$id,
          question: data.text,
        });
        setVotes((prevVotes) => ({ ...prevVotes, [userId]: "abstain" }));
      }
      setHasVoted(true);
      setIsSubmitted(true);
    }
  }
  return (
    <div>
      <h2 className="text-3xl text-center font-bold">{data.text}</h2>
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
            Hlasuj
          </button>
          {/* Display the combined result */}
          {voteSuccess !== null &&
            (voteSuccess ? (
              <button className="bg-green-500 text-white font-bold py-2 px-4">
                {"Schválené"}
              </button>
            ) : (
              <button className="bg-red-500 text-white font-bold py-2 px-4">
                {"Neschválené"}
              </button>
            ))}
        </form>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
