/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  databases,
  DB_ID,
  COLLECTION_ID,
  COLLECTION_ID1,
  account,
} from "../lib/appwrite";
import Vote from "./Vote";

export default function Question1({ data }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selected, setIsSelected] = useState("");

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
  const getCurrentUser = async () => {
    try {
      const user = await account.get();
      return user.$id;
    } catch (error) {
      console.error("Failied to get current user", error);
      return null;
    }
  };
  const userId = getCurrentUser();
  console.log(userId);

  const handleVote = (vote) => {
    setVotes((prevVotes) => ({ ...prevVotes, [currentUserId]: vote }));
  };

  /*  const handleSubmit = () => {
    const votingResult = isVotingSuccessful(votes);
    setResult(votingResult ? "Voting success!" : "Voting not successful.");
  }; */

  const getVoteData = (vote) => {
    const totalVotes = Object.values(votes).filter((v) => v === vote).length;
    const percentage = totalVotes
      ? (totalVotes / Object.keys(voters).length) * 100
      : 0;
    return { percentage, totalVotes };
  };

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const selectedVote = formData.get("vote");
    //data.$id=document
    if (selectedVote === data.odpoved_1) {
      databases.updateDocument(DB_ID, COLLECTION_ID, data.$id, {
        hlasy_1: data.hlasy_1 + 1,
      });
      databases.createDocument(DB_ID, COLLECTION_ID1, data.$id, {
        itemId: selected,
        userId: user["$id"],
      });
      // eslint-disable-next-line react/prop-types
    } else if (selectedVote === data.odpoved_2) {
      databases.updateDocument(DB_ID, COLLECTION_ID, data.$id, {
        hlasy_2: data.hlasy_2 + 1,
      });
      databases.createDocument(DB_ID, COLLECTION_ID1, data.$id, {
        itemId: selected,
        userId: user["$id"],
      });
    }

    setIsSubmitted(true);
  }

  if (!data) return null;

  const totalVotes = data.hlasy_1 + data.hlasy_2;

  return (
    <>
      <h2 className="text-3xl text-center font-bold">
        {"Vote base on population"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 votes-container"
      >
        <Vote
          text={data.odpoved_1}
          percentage={Math.floor((data.hlasy_1 / totalPopulation) * 100)}
          votes={data.hlasy_1}
          onClik={() => setIsSelected(data.odpoved_1)}
        />

        <Vote
          text={data.odpoved_2}
          percentage={Math.floor((data.hlasy_2 / totalPopulation) * 100)}
          votes={data.hlasy_2}
          onClik={() => setIsSelected(data.odpoved_1)}
        />

        <button
          type="submit"
          disabled={isSubmitted}
          className="cursor-pointer ml-auto my-6 rounded shadow bg-green-400 text-white font-medium text-lg py-2 px-10 transition hover:bg-white hover:text-green-400 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-100"
        >
          Vote
        </button>
      </form>
    </>
  );
}
