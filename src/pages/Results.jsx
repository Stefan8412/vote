import { useState, useEffect } from 'react';
import {
  databases,
  DB_ID,
  COLLECTION_ID,
  COLLECTION_ID3,
  Query,
} from '../lib/appwrite';
import { saveAs } from 'file-saver';

export default function Results() {
  const [questions, setQuestions] = useState([]); // List of all questions
  const [selectedQuestionId, setSelectedQuestionId] = useState(''); // Currently selected question ID
  const [results, setResults] = useState([]); // Raw results for the selected question
  const [voteCounts, setVoteCounts] = useState({}); // Aggregated vote counts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await databases.listDocuments(DB_ID, COLLECTION_ID);
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
        const response = await databases.listDocuments(DB_ID, COLLECTION_ID3, [
          Query.equal('questionId', selectedQuestionId),
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

          {/* Display aggregated vote counts */}
          <div className="mb-4">
            <p>
              <strong>ZA:</strong> {voteCounts['ZA'] || 0}
            </p>
            <p>
              <strong>PROTI:</strong> {voteCounts['PROTI'] || 0}
            </p>
            <p>
              <strong>ZDRŽAL SA:</strong> {voteCounts['ZDRŽAL SA'] || 0}
            </p>
          </div>

          {/* Export to CSV button */}
          <button
            onClick={exportResultsToCSV}
            className="px-4 py-2 bg-blue-500 text-white rounded mb-4 hover:bg-blue-600"
          >
            Stiahni výsledky
          </button>

          {/* Display detailed results */}
          <h3 className="text-lg font-medium mb-2">Detailné výsledky:</h3>
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
          </ul>
        </div>
      )}
    </div>
  );
}
