import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import DojoPage from './pages/DojoPage';
import CompletionPage from './pages/CompletionPage';
import { TrainingProvider } from './contexts/TrainingContext';

function App() {
  return (
    <TrainingProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dojo" element={<DojoPage />} />
            <Route path="/completion" element={<CompletionPage />} />
          </Routes>
        </div>
      </Router>
    </TrainingProvider>
  );
}

export default App;