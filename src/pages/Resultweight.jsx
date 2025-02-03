import { useState, useEffect } from 'react';
import {
  databases,
  DB_ID,
  COLLECTION_ID2,
  COLLECTION_ID1,
  Query,
  account,
} from '../lib/appwrite';
import { saveAs } from 'file-saver';

export default function Resultweight({ data }) {
  const [questions, setQuestions] = useState([]); // List of all questions
  const [selectedQuestionId, setSelectedQuestionId] = useState(''); // Currently selected question ID
  const [results, setResults] = useState([]); // Raw results for the selected question
  const [voteCounts, setVoteCounts] = useState({}); // Aggregated vote counts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [votes, setVotes] = useState({});
  const [result, setResult] = useState(null); // For population-based result
  const [result2, setResult2] = useState(null); // For special user result
  const [voteSuccess, setVoteSuccess] = useState(null); // Final combined result
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  const voters = {
    '6798a7040026fc9b6073': { population: 53203 },
    '678e0e59002db3a1f71a': { population: 19483 },
    '6788cb8b003017c9b115': { population: 31132 },
    '678a38c800015a6127c0': { population: 79305 },
    '679f91dd001d4b64938b': { population: 75561 },
    '67934bff0006d29eb850': { population: 58560 },
    '678fa2e7001960f89766': { population: 15319 },
    '67188ec8002555126f88': { population: 10646 },
    '6788af1e000840b29a56': { population: 126400 },
    '679b8e65001a5055d1c7': { population: 92759 },
    '6788d438001e4979a0d8': { population: 61913 },
    '6787a742002d1a4cea1b': { population: 33964 },
    '679b6f5f000fc2a1c156': { population: 82025 },
    '678f7d5d000c01bbbfaa': { population: 179 },
    '6787b571001f11c23993': { population: 3743 },
    '6787c10a0022dd543ab1': { population: 13907 },
    '67989ef40028708e4539': { population: 48640 },
    '6797dfc800351c2d901d': { population: 2399 },
  };

  const voterspecial = {
    '6798c9af0002ec190148': { population: 0 },
  };

  // Fetch all questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await databases.listDocuments(DB_ID, COLLECTION_ID2, [
          Query.limit(35),
        ]);
        setQuestions(response.documents);
        if (response.documents.length > 0) {
          setSelectedQuestionId(response.documents[0].$id); // Default to the first question
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions.');
      }
    };

    fetchQuestions();
  }, []);
  // Export results to CSV
  const exportResultsToCSV = () => {
    const csvHeader = 'User Email,Vote\n';
    const csvBody = results
      .map((result) => `${result.userEmail},${result.vote}`)
      .join('\n');

    const csvContent = csvHeader + csvBody;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'results.csv');
  };

  // Fetch results and calculate vote counts for the selected question
  useEffect(() => {
    if (!selectedQuestionId) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await databases.listDocuments(DB_ID, COLLECTION_ID1, [
          Query.equal('questionId', selectedQuestionId),
          Query.limit(35),
        ]);
        setResults(response.documents);

        // Calculate vote counts
        const counts = response.documents.reduce((acc, result) => {
          acc[result.vote] = (acc[result.vote] || 0) + 1;
          return acc;
        }, {});
        setVoteCounts(counts);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedQuestionId]);

  // Handle dropdown change
  const handleQuestionChange = (e) => {
    setSelectedQuestionId(e.target.value);
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

      console.log(votes, 'dfjh'); // Check the updated votes object here
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
          COLLECTION_ID1,
          [
            Query.equal('questionId', [selectedQuestionId]),
            Query.limit(35), // Fetch votes only for the specific question ID
          ]
        );
        console.log(voteDocuments, 'voteDocuments');
        const fetchedVotes = voteDocuments.documents.reduce((acc, doc) => {
          acc[doc.userId] = doc.vote; // Assuming vote is stored under `vote` key in Appwrite
          return acc;
        }, {});

        // Set the previously stored votes in state
        setVotes(fetchedVotes);
        console.log(fetchedVotes, 'Fetched votes');
      } catch (error) {
        console.error('Error fetching user or votes:', error);
      }
    };

    fetchUserAndVotes();
  }, [votes]);

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
      if (voterspec === '678b3f1a00218c054465') {
        if (votes[voterspec] === 'ZA') {
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

    // Calculate total population only from those who voted
    const totalPopulation = calculateTotalPopulationFromVotes(votes);
    console.log(totalPopulation, votes, 'votes');
    for (const voter of Object.keys(voters)) {
      if (votes[voter]) {
        const weight = (voters[voter].population / totalPopulation) * 100;
        totalWeight += weight;
        votedCount++;

        if (votes[voter] === 'ZA') {
          agreedWeight += weight;
        }
      }
    }

    const agreementThreshold = votedCount * 0.5;
    const successThreshold = totalWeight * 0.51;
    console.log(agreementThreshold, 'agreementThreshold');
    const populationVoteSuccessful =
      agreedWeight >= successThreshold &&
      agreedWeight > 0 &&
      votedCount >= agreementThreshold;
    const result = populationVoteSuccessful;

    return result;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Výsledky</h1>

      {/* Dropdown to select a question */}
      <div className="mb-4">
        <label htmlFor="questionSelect" className="block mb-2 font-medium">
          Vyberte otázku:
        </label>
        <select
          id="questionSelect"
          value={selectedQuestionId}
          onChange={handleQuestionChange}
          className="p-2 border rounded w-full"
        >
          {questions.map((question) => (
            <option key={question.$id} value={question.$id}>
              {question.text}
            </option>
          ))}
        </select>
      </div>

      {/* Display results */}
      {loading ? (
        <p>Loading results...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="results">
          <h2 className="text-xl font-semibold mb-4">
            Hlasovanie:{' '}
            {questions.find((q) => q.$id === selectedQuestionId)?.text || ''}
          </h2>

          {/* Display aggregated vote counts as rectangles */}
          <div className="mb-4 flex justify-between items-center">
            {/* ZA */}
            <div className="flex flex-col items-center">
              <div
                className="h-6 w-20 bg-blue-500"
                style={{
                  width: `${(voteCounts['ZA'] || 0) * 10}px`, // Adjust multiplier for scaling
                }}
              ></div>
              <span className="mt-2 text-lg font-bold">
                ZA: {voteCounts['ZA'] || 0}
              </span>
            </div>

            {/* PROTI */}
            <div className="flex flex-col items-center">
              <div
                className="h-6 w-20 bg-red-500"
                style={{
                  width: `${(voteCounts['PROTI'] || 0) * 10}px`,
                }}
              ></div>
              <span className="mt-2 text-lg font-bold">
                PROTI: {voteCounts['PROTI'] || 0}
              </span>
            </div>

            {/* ZDRŽAL SA */}
            <div className="flex flex-col items-center">
              <div
                className="h-6 w-20 bg-green-500"
                style={{
                  width: `${(voteCounts['ZDRŽAL SA'] || 0) * 10}px`,
                }}
              ></div>
              <span className="mt-2 text-lg font-bold">
                ZDRŽAL SA: {voteCounts['ZDRŽAL SA'] || 0}
              </span>
            </div>
          </div>
          {/* {voteSuccess !== null &&
            (voteSuccess ? (
              <button className="bg-green-500 text-white font-bold py-2 px-4">
                {'Schválené'}
              </button>
            ) : (
              <button className="bg-red-500 text-white font-bold py-2 px-4">
                {'Neschválené'}
              </button>
            ))} */}

          {/* Display detailed results */}
          {/* <h3 className="text-lg font-medium mb-2">Detailné výsledky:</h3>
          <ul>
            {results.map((result) => (
              <li key={result.$id} className="p-2 border-b">
                <p>
                  <strong>Hlasoval:</strong> {result.vote}
                </p>
                <p>
                  <strong>Používateľ:</strong> {result.userEmail}
                </p>
              </li>
            ))}
          </ul> */}

          {/* Export to CSV button */}
        </div>
      )}

      {/*  <button
        onClick={exportResultsToCSV}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4 hover:bg-blue-600"
      >
        Stiahni výsledky
      </button> */}
    </div>
  );
}
