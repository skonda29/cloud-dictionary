import React, { Profiler } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import App from './App';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import ErrorBoundary from './ErrorBoundary';

try {
  Amplify.configure(awsExports);
  console.log('Amplify configured successfully');
} catch (error) {
  console.error('Error configuring Amplify:', error);
}

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log(`Component ${id} metrics:`, {
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  });
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Profiler id="App" onRender={onRenderCallback}>
          <App />
        </Profiler>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
