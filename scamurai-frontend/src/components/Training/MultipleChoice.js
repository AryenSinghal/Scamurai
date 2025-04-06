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

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const OptionButton = styled.button`
  background-color: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #f5f5f5;
    border-color: #d0d0d0;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 87, 34, 0.3);
  }
`;

const OptionNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ff5722;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
`;

const OptionText = styled.div`
  flex: 1;
`;

const MultipleChoice = ({ options, scenarioIndex }) => {
  const { selectOption } = useContext(TrainingContext);
  
  const handleOptionClick = (optionIndex) => {
    selectOption(scenarioIndex, optionIndex);
  };
  
  return (
    <OptionsContainer>
      <QuestionText>What do you think about this message?</QuestionText>
      <OptionsList>
        {options.map((option, index) => (
          <OptionButton 
            key={index}
            onClick={() => handleOptionClick(index)}
          >
            <OptionNumber>{index + 1}</OptionNumber>
            <OptionText>{option}</OptionText>
          </OptionButton>
        ))}
      </OptionsList>
    </OptionsContainer>
  );
};

export default MultipleChoice;