import React, { useState, useEffect } from 'react';
import { get } from '@aws-amplify/api';
import { useNavigate } from 'react-router-dom';
import './AllTermsPage.css';

function AllTermsPage() {
  const [allTerms, setAllTerms] = useState([]);
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('az');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllTerms();
  }, []);

  useEffect(() => {
    let terms = [...allTerms];
    // First apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      terms = terms.filter(
        item => 
          item.term.toLowerCase().includes(query) ||
          item.definition.toLowerCase().includes(query)
      );
    }
    
    // Then apply sorting
    switch (sortOption) {
      case 'az':
        terms.sort((a, b) => a.term.toLowerCase().localeCompare(b.term.toLowerCase()));
        break;
      case 'za':
        terms.sort((a, b) => b.term.toLowerCase().localeCompare(a.term.toLowerCase()));
        break;
      default:
        break;
    }
    
    setFilteredTerms(terms);
  }, [searchQuery, allTerms, sortOption]);

  const fetchAllTerms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get({
        apiName: 'DictionaryAPI',
        path: '/terms',
      }).response;
      const data = await response.body.json();
      const terms = Array.isArray(data) ? data : [];
      setAllTerms(terms);
      setFilteredTerms(terms);
    } catch (err) {
      setError(err.message || 'Failed to fetch all terms.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="all-terms-page">
      <div className="header">
        <button onClick={handleBackClick} className="back-button action-button">
          ← Back to Search
        </button>
        <h1>Cloud Dictionary Terms</h1>
      </div>

      {!loading && !error && (
        <div className="controls-container">
          <div className="search-and-sort">
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search terms or definitions..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchQuery && (
                  <button onClick={handleClearSearch} className="clear-search">
                    ×
                  </button>
                )}
              </div>
            </div>
            
            <div className="sort-container">
              <select 
                value={sortOption} 
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="az">A to Z</option>
                <option value="za">Z to A</option>
              </select>
            </div>
          </div>

          <div className="search-stats">
            {filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'} found
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
          <span className="loading-text">Loading terms...</span>
        </div>
      ) : error ? (
        <div className="error-container">
          <h3>Error</h3>
          <p className="error-text">{error}</p>
        </div>
      ) : (
        <div className="terms-table-container">
          {filteredTerms.length > 0 ? (
            <table className="terms-table">
              <thead>
                <tr>
                  <th>Term</th>
                  <th>Definition</th>
                </tr>
              </thead>
              <tbody>
                {filteredTerms.map((item) => (
                  <tr key={item.term}>
                    <td className="term-cell">{item.term}</td>
                    <td className="definition-cell">{item.definition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              {searchQuery
                ? `No terms found matching "${searchQuery}"`
                : 'No terms found in the dictionary. Add some terms to get started!'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AllTermsPage;