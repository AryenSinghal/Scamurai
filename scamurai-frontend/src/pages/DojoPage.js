import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { TrainingContext } from '../contexts/TrainingContext';
import Header from '../components/Common/Header';
import LoadingSpinner from '../components/Common/LoadingSpinner.js';
import ChatSimulator from '../components/Chat/ChatSimulator';
import EmailSimulator from '../components/Email/EmailSimulator';
import MultipleChoice from '../components/Training/MultipleChoice';
import FeedbackPanel from '../components/Training/FeedbackPanel';

const DojoContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const ScenarioContainer = styled.div`
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px 0;
`;

const ScenarioHeader = styled.div`
  background-color: #f1f5fd;
  padding: 15px;
  border-radius: 8px 8px 0 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const ScenarioTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0;
`;

const ScenarioProgress = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 1rem;
  color: #666;
`;

const ProgressDots = styled.div`
  display: flex;
  margin-left: 10px;
`;

const ProgressDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#ff5722' : '#ddd'};
  margin-right: 5px;
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
`;

const DojoPage = () => {
  const {
    contentType,
    originalContent,
    loading,
    error,
    scenarios,
    currentScenarioIndex,
    currentScenario,
    showFeedback,
    completed
  } = useContext(TrainingContext);

  // Redirect to completion page if training is complete
  if (completed) {
    return <Navigate to="/completion" />;
  }

  // Show loading spinner while fetching scenarios
  if (loading) {
    return (
      <DojoContainer>
        <Header />
        <LoadingSpinner message="Preparing your training scenarios..." />
      </DojoContainer>
    );
  }

  // Show error message if there was a problem
  if (error) {
    return (
      <DojoContainer>
        <Header />
        <ErrorMessage>{error}</ErrorMessage>
      </DojoContainer>
    );
  }

  // If no content type or scenarios, show message
  if (!contentType || !scenarios || scenarios.length === 0) {
    return (
      <DojoContainer>
        <Header />
        <ErrorMessage>
          No training scenarios available. Please start from the Scamurai extension.
        </ErrorMessage>
      </DojoContainer>
    );
  }

  return (
    <DojoContainer>
      <Header />
      
      <ScenarioContainer>
        <ScenarioHeader>
          <ScenarioTitle>Scenario {currentScenarioIndex + 1}</ScenarioTitle>
          <ScenarioProgress>
            Progress: {currentScenarioIndex + 1} / {scenarios.length}
            <ProgressDots>
              {scenarios.map((_, index) => (
                <ProgressDot key={index} active={index <= currentScenarioIndex} />
              ))}
            </ProgressDots>
          </ScenarioProgress>
        </ScenarioHeader>

        {/* Display the appropriate simulator based on content type */}
        {contentType === 'chat' ? (
          <ChatSimulator content={currentScenario?.content} />
        ) : (
          <EmailSimulator content={currentScenario?.content} />
        )}

        {/* Multiple choice options */}
        {!showFeedback && currentScenario && (
          <MultipleChoice 
            options={currentScenario.options} 
            scenarioIndex={currentScenarioIndex}
          />
        )}

        {/* Feedback after answering */}
        {showFeedback && currentScenario && (
          <FeedbackPanel 
            scenario={currentScenario}
            selectedOption={currentScenario.options} 
            scenarioIndex={currentScenarioIndex}
          />
        )}
      </ScenarioContainer>
    </DojoContainer>
  );
};

export default DojoPage;