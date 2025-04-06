import React, { useContext } from 'react';
import styled from 'styled-components';
import { TrainingContext } from '../../contexts/TrainingContext';

const FeedbackContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  border-radius: 8px;
  background-color: ${props => props.isCorrect ? '#e8f5e9' : '#ffebee'};
  border-left: 5px solid ${props => props.isCorrect ? '#4caf50' : '#f44336'};
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const ResultIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.isCorrect ? '#4caf50' : '#f44336'};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  margin-right: 15px;
`;

const ResultText = styled.h3`
  font-size: 1.4rem;
  margin: 0;
  color: ${props => props.isCorrect ? '#2e7d32' : '#c62828'};
`;

const ExplanationText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 20px;
`;

const SelectedOption = styled.div`
  background-color: rgba(0, 0, 0, 0.05);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const OptionLabel = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
`;

const CorrectOption = styled.div`
  background-color: rgba(76, 175, 80, 0.15);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 3px solid #4caf50;
`;

const NextButton = styled.button`
  background-color: #ff5722;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  
  &:hover {
    background-color: #e64a19;
    transform: translateY(-2px);
  }
`; 

const FeedbackPanel = ({ scenario, scenarioIndex }) => {
  const { selectedOptions, goToNextScenario } = useContext(TrainingContext);
  
  // Get the user's selected option
  const selectedOptionIndex = selectedOptions[scenarioIndex];
  
  // Check if the selection was correct
  const isCorrect = selectedOptionIndex === scenario.correctOption;
  
  return (
    <FeedbackContainer isCorrect={isCorrect}>
      <ResultHeader>
        <ResultIcon isCorrect={isCorrect}>
          {isCorrect ? '✓' : '✗'}
        </ResultIcon>
        <ResultText isCorrect={isCorrect}>
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </ResultText>
      </ResultHeader>
      
      <ExplanationText>
        {scenario.explanation}
      </ExplanationText>
      
      {!isCorrect && (
        <>
          <SelectedOption>
            <OptionLabel>You selected:</OptionLabel>
            {scenario.options[selectedOptionIndex]}
          </SelectedOption>
          
          <CorrectOption>
            <OptionLabel>Correct answer:</OptionLabel>
            {scenario.options[scenario.correctOption]}
          </CorrectOption>
        </>
      )}
      
      <NextButton onClick={goToNextScenario}>
        {scenarioIndex < 3 ? 'Next Example' : 'View Results'}
      </NextButton>
    </FeedbackContainer>
  );
};

export default FeedbackPanel;