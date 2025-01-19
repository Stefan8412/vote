import { useState, useEffect } from 'react';

import { DB_ID, COLLECTION_ID, databases } from '../lib/appwrite';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const response = await databases.listDocuments(DB_ID, COLLECTION_ID);
        setResults(response.documents); // Assuming `documents` contains vote data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching results:', error);
        setLoading(false);
      }
    }

    fetchResults();
  }, []);

  if (loading) return <p>Loading results...</p>;

  return (
    <div>
      <h1>Výsledky hlasovania</h1>
      <table>
        <thead>
          <tr>
            <th>Otázka</th>
            <th>ZA</th>
            <th>PROTI</th>
            <th>ZDRŽAL SA</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.$id}>
              <td>{result.text}</td>
              <td>{result.hlasy_1}</td>
              <td>{result.hlasy_2}</td>
              <td>{result.hlasy_3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Results;
