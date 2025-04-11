/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import {
  account,
  databases,
  DB_ID,
  Query,
  COLLECTION_ID,
  COLLECTION_ID3,
} from '../lib/appwrite';

import Vote from './Vote';

export default function Question({ data }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get(); // Fetch the user data
        setUserEmail(user.email);
        setUserId(user.$id); // Set the user ID
        console.log(user);
        checkIfUserHasVoted(user.email);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [data]);

  const checkIfUserHasVoted = async (userEmail) => {
    try {
      console.log('Checking vote status for:', userEmail, data.$id);

      // Ensure userEmail and data.$id are valid
      if (!userEmail || !data?.$id) {
        throw new Error('Missing user email or question ID.');
      }

      // Query the votes collection to check if the user has voted on this question
      const votes = await databases.listDocuments(DB_ID, COLLECTION_ID3, [
        Query.equal('userEmail', [userEmail]), // Wrap value in an array
        Query.equal('questionId', [data.$id]), // Wrap value in an array
        Query.limit(35),
      ]);

      // Check if the user has voted on this question
      if (votes.documents.length > 0) {
        setHasVoted(true); // The user has already voted
        setIsSubmitted(true); // Disable the voting form
      }
    } catch (error) {
      console.error('Error checking vote status:', error);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const selectedVote = formData.get('vote');

    if (!hasVoted) {
      const handleVoteUpdate = async (field, voteLabel) => {
        try {
          // Fetch the latest data for this question
          const document = await databases.getDocument(
            DB_ID,
            COLLECTION_ID,
            data.$id
          );

          // Increment the selected vote field
          const updatedVotes = document[field] + 1;

          // Update the document with the new vote count
          await databases.updateDocument(DB_ID, COLLECTION_ID, data.$id, {
            [field]: updatedVotes,
          });

          // Record the vote in the votes collection
          await databases.createDocument(DB_ID, COLLECTION_ID3, 'unique()', {
            userId: userId, // Store the user ID along with the vote
            vote: voteLabel,
            userEmail: userEmail,
            questionId: data.$id,
            question: data.text,
          });

          // Update local state
          setIsSubmitted(true);
          setHasVoted(true);
        } catch (error) {
          console.error('Error updating vote:', error);
        }
      };

      if (selectedVote === data.odpoved_1) {
        handleVoteUpdate('hlasy_1', 'ZA');
      } else if (selectedVote === data.odpoved_2) {
        handleVoteUpdate('hlasy_2', 'PROTI');
      } else if (selectedVote === data.odpoved_3) {
        handleVoteUpdate('hlasy_3', 'ZDRŽAL SA');
      }
    }
  }

  if (!data) return null;
  const totalVotes = data.hlasy_1 + data.hlasy_2 + data.hlasy_3;

  return (
    <>
      <h2 className="text-3xl text-center font-bold">{data.text}</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 votes-container"
      >
        <Vote
          text={data.odpoved_1}
          /*    percentage={Math.floor((data.hlasy_1 / totalVotes) * 100)}
          votes={data.hlasy_1} */
        />

        <Vote
          text={data.odpoved_2}
          /*   percentage={Math.floor((data.hlasy_2 / totalVotes) * 100)}
          votes={data.hlasy_2} */
        />

        <Vote
          text={data.odpoved_3}
          /*  percentage={Math.floor((data.hlasy_3 / totalVotes) * 100)}
          votes={data.hlasy_3} */
        />

        <button
          type="submit"
          disabled={isSubmitted}
          className="cursor-pointer ml-auto my-6 rounded shadow bg-blue-400 text-white font-medium text-lg py-2 px-10 transition hover:bg-white hover:text-green-400 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-100"
        >
          Hlasuj
        </button>
      </form>
    </>
  );
}
