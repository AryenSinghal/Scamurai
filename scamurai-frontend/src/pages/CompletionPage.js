import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { TrainingContext } from '../contexts/TrainingContext';
import Header from '../components/Common/Header';

const CompletionContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  text-align: center;
`;

const CompletionCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  margin: 40px 0;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 30px;
  font-weight: normal;
`;

const ScoreDisplay = styled.div`
  margin: 30px 0;
`;

const ScoreCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: ${props => {
    if (props.score >= 3) return '#4caf50';
    if (props.score >= 2) return '#ff9800';
    return '#f44336';
  }};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  margin: 0 auto;
`;

const ScoreNumber = styled.div`
  font-size: 2.5rem;
`;

const ScoreLabel = styled.div`
  font-size: 1rem;
`;

const ScoreText = styled.p`
  font-size: 1.2rem;
  color: #333;
  margin-top: 15px;
`;

const ButtonContainer = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#ff5722' : '#fff'};
  color: ${props => props.primary ? '#fff' : '#ff5722'};
  border: 2px solid #ff5722;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 250px;

  &:hover {
    background-color: ${props => props.primary ? '#e64a19' : '#fff5f0'};
    transform: translateY(-2px);
  }
`;

const CompletionPage = () => {
  const { 
    score, 
    scenarios, 
    returnUrl, 
    completed, 
    resetTraining 
  } = useContext(TrainingContext);
  
  const navigate = useNavigate();

  // If not completed, redirect to dojo
  useEffect(() => {
    if (!completed) {
      navigate('/dojo');
    }
  }, [completed, navigate]);

  // Function to handle return to original site
  const handleReturn = () => {
    if (returnUrl) {
      window.location.href = returnUrl;
    } else {
      // If no return URL, just go to home
      resetTraining();
      navigate('/');
    }
  };

  // Function to restart training
  const handleRestart = () => {
    resetTraining();
    navigate('/dojo');
  };

  // Calculate percentage
  const percentage = scenarios.length > 0 
    ? Math.round((score / scenarios.length) * 100)
    : 0;

  return (
    <CompletionContainer>
      <Header />
      
      <CompletionCard>
        <Title>Training Completed!</Title>
        <Subtitle>You've completed the Scamurai Dojo training</Subtitle>
        
        <ScoreDisplay>
          <ScoreCircle score={score}>
            <ScoreNumber>{score}</ScoreNumber>
            <ScoreLabel>/ {scenarios.length}</ScoreLabel>
          </ScoreCircle>
          <ScoreText>
            You scored {percentage}% by correctly identifying {score} out of {scenarios.length} scam scenarios.
          </ScoreText>
        </ScoreDisplay>
        
        {percentage >= 75 ? (
          <p>Excellent work! You're well-equipped to identify scams in the wild.</p>
        ) : percentage >= 50 ? (
          <p>Good job! With a bit more practice, you'll be a scam detection expert.</p>
        ) : (
          <p>Keep practicing! Scam detection takes time to master.</p>
        )}
        
        <ButtonContainer>
          <Button primary onClick={handleReturn}>
            Return to Original Site
          </Button>
          <Button onClick={handleRestart}>
            Try Again
          </Button>
        </ButtonContainer>
      </CompletionCard>
    </CompletionContainer>
  );
};

export default CompletionPage;