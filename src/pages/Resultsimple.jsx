import { useState, useEffect } from 'react';
import {
  databases,
  DB_ID,
  COLLECTION_ID,
  COLLECTION_ID3,
  Query,
} from '../lib/appwrite';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export default function Resultsimple() {
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
    // Prepare data
    const worksheetData = [
      ['Otázka', 'Email', 'Hlasoval'], // Headers
      ...results.map((result) => [
        result.question,
        result.userEmail,
        result.vote,
      ]),
    ];

    // Create a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Výsledky');

    // Generate and save the XLSX file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'results.xlsx');
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
      {/* Export to CSV button */}
      <button
        onClick={exportResultsToCSV}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4 hover:bg-blue-600"
      >
        Stiahni výsledky
      </button>
    </div>
  );
}
