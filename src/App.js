import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { get, post } from '@aws-amplify/api';
import AllTermsPage from './AllTermsPage';
import './App.css';

function App() {
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateInputs = (action) => {
    if (action === 'search' && !term.trim()) {
      setError('Please enter a term to search');
      return false;
    }
    if (action === 'add' && (!term.trim() || !definition.trim())) {
      setError('Please enter both a term and a definition to add');
      return false;
    }
    return true;
  };

  const searchTerm = async () => {
    if (!validateInputs('search')) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await get({
        apiName: 'DictionaryAPI',
        path: `/terms/${term}`,
      }).response;
      const data = await response.body.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to search term.');
    } finally {
      setLoading(false);
    }
  };

  const addTerm = async () => {
    if (!validateInputs('add')) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await post({
        apiName: 'DictionaryAPI',
        path: '/terms',
        options: {
          body: { term, definition },
        },
      }).response;
      const data = await response.body.json();
      setResult(data);
      setTerm('');
      setDefinition('');
    } catch (err) {
      setError(err.message || 'Failed to add term.');
    } finally {
      setLoading(false);
    }
  };

  const handleAllTermsClick = () => {
    navigate('/all-terms');
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1 className="title">Cloud Dictionary</h1>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Enter term"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="input-field"
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Enter definition (for adding)"
                  value={definition}
                  onChange={(e) => setDefinition(e.target.value)}
                  className="input-field"
                  disabled={loading}
                />
                <div className="button-container">
                  <button onClick={searchTerm} className="action-button" disabled={loading}>
                    {loading ? 'Searching...' : 'Search Term'}
                  </button>
                  <button onClick={addTerm} className="action-button" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Term'}
                  </button>
                  <button onClick={handleAllTermsClick} className="action-button" disabled={loading}>
                    All Terms
                  </button>
                </div>
              </div>
              {result && (
                <div className="result-container">
                  <h3>Result:</h3>
                  <pre className="result-text">{JSON.stringify(result, null, 2)}</pre>
                </div>
              )}
              {error && (
                <div className="error-container">
                  <h3>Error:</h3>
                  <p className="error-text">{error}</p>
                </div>
              )}
            </>
          }
        />
        <Route path="/all-terms" element={<AllTermsPage />} />
      </Routes>
    </div>
  );
}

export default App;