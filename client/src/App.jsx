import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ClaimDetailsPage from './pages/ClaimDetailsPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/claim/:id" element={<ClaimDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
