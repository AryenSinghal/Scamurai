import React, { useContext } from 'react';
import styled from 'styled-components';
import { TrainingContext } from '../../contexts/TrainingContext';

const OptionsContainer = styled.div`
  margin-top: 30px;
  padding: 25px;
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    background-color: var(--primary);
  }
`;

const QuestionText = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: var(--primary);
  text-align: center;
  font-family: var(--font-heading);
  position: relative;
  
  &::after {
    content: "";
    display: block;
    width: 80px;
    height: 3px;
    background-color: var(--primary);
    margin: 15px auto 0;
  }
`;

const OptionsWrapper = styled.div`
  display: flex;
  gap: 25px;
  margin-top: 25px;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const OptionButton = styled.button`
  position: relative;
  background-color: ${props => props.isScam ? 'rgba(193, 18, 31, 0.05)' : 'rgba(53, 94, 59, 0.05)'};
  color: ${props => props.isScam ? 'var(--accent)' : 'var(--secondary)'};
  border: 2px solid ${props => props.isScam ? 'var(--accent)' : 'var(--secondary)'};
  border-radius: var(--radius-md);
  padding: 20px 30px;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  max-width: 240px;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
  
  &:hover {
    background-color: ${props => props.isScam ? 'var(--accent)' : 'var(--secondary)'};
    color: white;
    transform: translateY(-3px);
    box-shadow: var(--shadow-medium);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.isScam ? 'rgba(193, 18, 31, 0.3)' : 'rgba(53, 94, 59, 0.3)'};
  }
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: ${props => props.isScam
        ? 'url("/images/danger-pattern.svg")'
        : 'url("/images/bamboo-pattern.svg")'};
    background-size: 200px;
    opacity: 0.05;
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 15px;
  }
`;

const OptionIcon = styled.span`
  font-size: 1.8rem;
  margin-right: 15px;
  
  svg {
    width: 30px;
    height: 30px;
    fill: currentColor;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-right: 10px;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const OptionText = styled.span`
  letter-spacing: 0.03em;
`;

const MultipleChoice = ({ scenario, scenarioIndex }) => {
    const { selectOption } = useContext(TrainingContext);

    const handleOptionClick = (isScam) => {
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
                    <OptionText>SCAM</OptionText>
                </OptionButton>
                <OptionButton
                    isScam={false}
                    onClick={() => handleOptionClick(false)}
                >
                    <OptionIcon>✓</OptionIcon>
                    <OptionText>SAFE</OptionText>
                </OptionButton>
            </OptionsWrapper>
        </OptionsContainer>
    );
};

export default MultipleChoice;