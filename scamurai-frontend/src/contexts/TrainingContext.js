// Copy content from the training-context artifact
import React, { createContext, useState, useEffect } from 'react';
import { fetchTrainingScenarios } from '../utils/api';

export const TrainingContext = createContext();

export const TrainingProvider = ({ children }) => {
  // Training states
  const [contentType, setContentType] = useState(''); // 'email' or 'chat'
  const [originalContent, setOriginalContent] = useState('');
  const [returnUrl, setReturnUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Scenarios
  const [scenarios, setScenarios] = useState([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Parse URL parameters on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const content = params.get('content');
    const url = params.get('returnUrl');
    
    if (type) setContentType(type);
    if (content) setOriginalContent(decodeURIComponent(content));
    if (url) setReturnUrl(decodeURIComponent(url));
    
    // Load training scenarios if we have the necessary information
    if (type && content) {
      loadScenarios(type, content);
    }
  }, []);
  
  // Load scenarios from API
  const loadScenarios = async (type, content) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchTrainingScenarios(type, content);
      setScenarios(data.scenarios);
    } catch (err) {
      setError('Failed to load training scenarios. Please try again.');
      console.error('Error loading scenarios:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle option selection
  const selectOption = (scenarioIndex, optionIndex) => {
    setSelectedOptions({
      ...selectedOptions,
      [scenarioIndex]: optionIndex
    });
    setShowFeedback(true);
  };
  
  // Move to next scenario
  const goToNextScenario = () => {
    setShowFeedback(false);
    
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
    } else {
      // Calculate score and mark as completed
      const correctAnswers = Object.keys(selectedOptions).filter(
        scenarioIndex => selectedOptions[scenarioIndex] === scenarios[scenarioIndex].correctOption
      ).length;
      
      setScore(correctAnswers);
      setCompleted(true);
    }
  };
  
  // Reset training session
  const resetTraining = () => {
    setCurrentScenarioIndex(0);
    setSelectedOptions({});
    setShowFeedback(false);
    setCompleted(false);
    setScore(0);
  };
  
  return (
    <TrainingContext.Provider
      value={{
        contentType,
        originalContent,
        returnUrl,
        loading,
        error,
        scenarios,
        currentScenarioIndex,
        currentScenario: scenarios[currentScenarioIndex],
        selectedOptions,
        showFeedback,
        completed,
        score,
        selectOption,
        goToNextScenario,
        resetTraining
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};