import React, { useState, useEffect } from 'react';
import { get } from '@aws-amplify/api';
import './AllTermsPage.css';

function AllTermsPage() {
  const [allTerms, setAllTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllTerms();
  }, []);

  const fetchAllTerms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get({
        apiName: 'DictionaryAPI',
        path: '/terms',
      }).response;
      const data = await response.body.json();
      setAllTerms(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch all terms.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="all-terms-page">
      <h1>All Terms</h1>
      {loading && <div className="loading-spinner">Loading...</div>}
      {error && (
        <div className="error-container">
          <h3>Error:</h3>
          <p className="error-text">{error}</p>
        </div>
      )}
      {!loading && !error && (
        <table className="terms-table">
          <thead>
            <tr>
              <th>Term</th>
              <th>Definition</th>
            </tr>
          </thead>
          <tbody>
            {allTerms.length > 0 ? (
              allTerms.map((item) => (
                <tr key={item.term}>
                  <td>{item.term}</td>
                  <td>{item.definition}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No terms found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllTermsPage;