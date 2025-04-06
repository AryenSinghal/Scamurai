import React, { useContext } from 'react';
import styled from 'styled-components';
import { TrainingContext } from '../../contexts/TrainingContext';

const OptionsContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const QuestionText = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 20px;
  color: #333;
`;

const OptionsWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  justify-content: center;
`;

const OptionButton = styled.button`
  background-color: ${props => props.isScam ? '#ffebee' : '#e8f5e9'};
  color: ${props => props.isScam ? '#c62828' : '#2e7d32'};
  border: 2px solid ${props => props.isScam ? '#f44336' : '#4caf50'};
  border-radius: 8px;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  max-width: 200px;
  
  &:hover {
    background-color: ${props => props.isScam ? '#f44336' : '#4caf50'};
    color: white;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 87, 34, 0.3);
  }
`;

const OptionIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 10px;
`;

const MultipleChoice = ({ scenario, scenarioIndex }) => {
  const { selectOption } = useContext(TrainingContext);
  
  const handleOptionClick = (isScam) => {
    // In our new version, we're comparing a boolean value (user's choice) 
    // against the isScam property in the scenario
    selectOption(scenarioIndex, isScam);
  };
  
  return (
    <OptionsContainer>
      <QuestionText>Is this message a scam or safe?</QuestionText>
      <OptionsWrapper>
        <OptionButton 
          isScam={true} 
          onClick={() => handleOptionClick(true)}
        >
          <OptionIcon>⚠️</OptionIcon>
          Scam
        </OptionButton>
        <OptionButton 
          isScam={false} 
          onClick={() => handleOptionClick(false)}
        >
          <OptionIcon>✓</OptionIcon>
          Safe
        </OptionButton>
      </OptionsWrapper>
    </OptionsContainer>
  );
};

export default MultipleChoice;