/* eslint-disable react/prop-types */
import { useState } from "react";
import { databases, DB_ID, COLLECTION_ID } from "../lib/appwrite";
import Vote from "./Vote";

export default function Question({ data }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const selectedVote = formData.get("vote");

    if (selectedVote === data.odpoved_1) {
      databases.updateDocument(DB_ID, COLLECTION_ID, data.$id, {
        hlasy_1: data.hlasy_1 + 1,
      });
      // eslint-disable-next-line react/prop-types
    } else if (selectedVote === data.odpoved_2) {
      databases.updateDocument(DB_ID, COLLECTION_ID, data.$id, {
        hlasy_2: data.hlasy_2 + 1,
      });
    }

    setIsSubmitted(true);
  }

  if (!data) return null;

  const totalVotes = data.hlasy_1 + data.hlasy_2;

  return (
    <>
      <h2 className="text-3xl text-center font-bold">{data.text}</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 votes-container"
      >
        <Vote
          text={data.odpoved_1}
          percentage={Math.floor((data.hlasy_1 / totalVotes) * 100)}
          votes={data.hlasy_1}
        />

        <Vote
          text={data.odpoved_2}
          percentage={Math.floor((data.hlasy_2 / totalVotes) * 100)}
          votes={data.hlasy_2}
        />

        <button
          type="submit"
          disabled={isSubmitted}
          className="cursor-pointer ml-auto my-6 rounded shadow bg-green-400 text-white font-medium text-lg py-2 px-10 transition hover:bg-white hover:text-green-400 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-100"
        >
          Hlasuj
        </button>
      </form>
    </>
  );
}