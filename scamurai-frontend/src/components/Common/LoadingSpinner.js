import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframes for the spinning katana animation
const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Pulsing animation for the container
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 30px;
  animation: ${pulseAnimation} 2s ease-in-out infinite;
`;

const KatanaSpinner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid var(--rice-paper);
  border-top: 4px solid var(--primary);
  animation: ${spinAnimation} 1.5s linear infinite;
  
  &::before {
    content: "";
    position: absolute;
    top: -4px;
    right: 25%;
    width: 16px;
    height: 16px;
    background-color: var(--primary);
    border-radius: 50%;
  }
`;

// Second spinning circle - offset from the first
const InnerSpinner = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  width: calc(100% - 30px);
  height: calc(100% - 30px);
  border-radius: 50%;
  border: 3px solid var(--rice-paper);
  border-bottom: 3px solid var(--accent);
  animation: ${spinAnimation} 2s linear infinite reverse;
`;

// Center decoration
const SpinnerCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background-color: var(--rice-paper);
  border-radius: 50%;
  border: 2px solid var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
`;

const Message = styled.p`
  font-size: 1.3rem;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.5;
  font-family: var(--font-heading);
  position: relative;
  
  &::after {
    content: "...";
    animation: ellipsis 1.5s infinite;
  }
  
  @keyframes ellipsis {
    0% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.3;
    }
  }
`;

const JapaneseText = styled.div`
  font-size: 1rem;
  color: var(--text-secondary);
  margin-top: 5px;
  font-style: italic;
`;

const LoadingSpinner = ({ message = 'Loading', japaneseText = '読み込み中' }) => {
    return (
        <SpinnerContainer>
            <SpinnerWrapper>
                <KatanaSpinner />
                <InnerSpinner />
                <SpinnerCenter>道</SpinnerCenter>
            </SpinnerWrapper>
            <Message>{message}</Message>
            <JapaneseText>{japaneseText}</JapaneseText>
        </SpinnerContainer>
    );
};

export default LoadingSpinner;