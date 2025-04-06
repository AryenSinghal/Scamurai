import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { TrainingContext } from '../contexts/TrainingContext';
import Header from '../components/Common/Header';

const PageContainer = styled.div`
  background: linear-gradient(to bottom, var(--primary), #1a3547);
  min-height: 100vh;
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 0;
  }
`;

const CompletionContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: var(--font-body);
  position: relative;
  z-index: 1;
`;

const CompletionCard = styled.div`
  background-color: var(--rice-paper);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-hard);
  padding: 40px;
  margin: 40px 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background-color: var(--primary);
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/images/rice-paper-texture.png');
    background-repeat: repeat;
    opacity: 0.4;
    pointer-events: none;
    z-index: -1;
  }
`;

const TitleContainer = styled.div`
  margin-bottom: 30px;
  text-align: center;
  position: relative;
  
  &::after {
    content: "⦿";
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    color: var(--primary);
    font-size: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 15px;
  font-family: var(--font-heading);
  position: relative;
  display: inline-block;
  
  &::before, &::after {
    content: "〜";
    color: var(--accent);
    font-size: 2rem;
    position: relative;
    top: -0.5rem;
    margin: 0 10px;
    opacity: 0.7;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
  font-weight: normal;
  font-style: italic;
`;

const ScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0;
`;

const ScoreCircleWrapper = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  padding: 10px;
  background: ${props => {
        if (props.percentage >= 75) return 'linear-gradient(135deg, #355e3b, #4caf50)';
        if (props.percentage >= 50) return 'linear-gradient(135deg, #e65100, #ff9800)';
        return 'linear-gradient(135deg, #8b0000, #c62828)';
    }};
  margin-bottom: 25px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* Decorative Japanese-style elements */
  &::before, &::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${props => {
        if (props.percentage >= 75) return '#4caf50';
        if (props.percentage >= 50) return '#ff9800';
        return '#c62828';
    }};
    box-shadow: 0 0 0 3px var(--rice-paper);
  }
  
  &::before {
    top: 15px;
    left: 15px;
  }
  
  &::after {
    bottom: 15px;
    right: 15px;
  }
`;

const ScoreCircle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--rice-paper);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: var(--font-heading);
`;

const ScoreFraction = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 5px;
`;

const ScoreNumber = styled.div`
  font-size: 3.5rem;
  font-weight: bold;
  color: ${props => {
        if (props.percentage >= 75) return 'var(--bamboo-green)';
        if (props.percentage >= 50) return '#ff9800';
        return 'var(--accent)';
    }};
  line-height: 1;
`;

const ScoreTotal = styled.div`
  font-size: 1.8rem;
  color: var(--text-secondary);
  margin-left: 5px;
`;

const ScoreLabel = styled.div`
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-top: 5px;
`;

const ScoreText = styled.p`
  font-size: 1.3rem;
  color: var(--text-primary);
  text-align: center;
  max-width: 600px;
  margin: 0 auto 30px;
  line-height: 1.6;
`;

const ResultMessage = styled.div`
  margin: 20px 0 40px;
  padding: 20px;
  background-color: ${props => {
        if (props.percentage >= 75) return 'rgba(53, 94, 59, 0.1)';
        if (props.percentage >= 50) return 'rgba(255, 152, 0, 0.1)';
        return 'rgba(193, 18, 31, 0.1)';
    }};
  border-left: 5px solid ${props => {
        if (props.percentage >= 75) return 'var(--bamboo-green)';
        if (props.percentage >= 50) return '#ff9800';
        return 'var(--accent)';
    }};
  border-radius: var(--radius-md);
  position: relative;
  
  p {
    font-size: 1.1rem;
    margin: 0;
    line-height: 1.6;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Button = styled.button`
  position: relative;
  background-color: ${props => props.primary ? 'var(--primary)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--primary)'};
  border: ${props => props.primary ? 'none' : '2px solid var(--primary)'};
  border-radius: 30px;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 280px;
  text-align: center;
  box-shadow: ${props => props.primary ? 'var(--shadow-medium)' : 'none'};
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/images/japanese-pattern.svg');
    background-size: 200px;
    opacity: ${props => props.primary ? '0.1' : '0'};
    z-index: -1;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background-color: ${props => props.primary ? '#1a3547' : 'rgba(38, 70, 83, 0.05)'};
    transform: translateY(-3px);
    box-shadow: ${props => props.primary ? 'var(--shadow-hard)' : 'var(--shadow-soft)'};
    
    &::before {
      opacity: ${props => props.primary ? '0.2' : '0.05'};
    }
  }
  
  svg {
    width: 20px;
    height: 20px;
    margin-left: 10px;
    vertical-align: middle;
    fill: currentColor;
  }
`;

const ScrollElement = styled.div`
  width: 100px;
  height: 100px;
  position: absolute;
  opacity: 0.2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  
  &.top-left {
    top: -20px;
    left: -20px;
    transform: rotate(-30deg);
  }
  
  &.bottom-right {
    bottom: -20px;
    right: -20px;
    transform: rotate(30deg);
  }
`;

const WisdomQuote = styled.div`
  margin: 40px auto;
  max-width: 600px;
  text-align: center;
  padding: 30px;
  position: relative;
  
  &::before, &::after {
    content: """;
    font-size: 5rem;
    position: absolute;
    color: var(--primary);
    opacity: 0.1;
    font-family: serif;
    line-height: 1;
  }
  
  &::before {
    top: 0;
    left: 0;
  }
  
  &::after {
    content: """;
    bottom: 0;
    right: 0;
  }
`;

const WisdomText = styled.p`
  font-size: 1.3rem;
  color: var(--text-primary);
  font-style: italic;
  margin: 0;
  line-height: 1.8;
`;

// Array of samurai completion wisdom quotes
const samuraiWisdom = [
    "The way of the warrior is to master the virtue of his weapons.",
    "In battle, if you make your opponent flinch, you have already won.",
    "The true victory is to see through the illusion of your opponent's strength.",
    "A sword by itself does not slay; it is merely a tool in the killer's hands.",
    "The ultimate aim of martial arts is not having to use them.",
    "From one thing, know ten thousand things.",
    "Perception is strong and sight weak. In strategy it is important to see distant things as if they were close and to take a distanced view of close things."
];

// Get a random wisdom quote
const getRandomWisdom = () => {
    const randomIndex = Math.floor(Math.random() * samuraiWisdom.length);
    return samuraiWisdom[randomIndex];
};

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

    // Get result message
    const getResultMessage = () => {
        if (percentage >= 75) {
            return "You have shown the wisdom and discernment of a true Scamurai master. Your vigilant eye can detect the most subtle signs of deception.";
        } else if (percentage >= 50) {
            return "You are on the path to becoming a Scamurai. Continue your training, and soon you will see through all deception.";
        } else {
            return "The path of the Scamurai requires patience and practice. Return to your training with renewed focus.";
        }
    };

    return (
        <PageContainer>
            <Header />
            <CompletionContainer>
                <CompletionCard>
                    <ScrollElement className="top-left">📜</ScrollElement>
                    <ScrollElement className="bottom-right">📜</ScrollElement>

                    <TitleContainer>
                        <Title>Training Complete</Title>
                        <Subtitle>Your journey in the Scamurai Dojo has concluded</Subtitle>
                    </TitleContainer>

                    <ScoreContainer>
                        <ScoreCircleWrapper percentage={percentage}>
                            <ScoreCircle>
                                <ScoreFraction>
                                    <ScoreNumber percentage={percentage}>{score}</ScoreNumber>
                                    <ScoreTotal>/{scenarios.length}</ScoreTotal>
                                </ScoreFraction>
                                <ScoreLabel>CORRECT</ScoreLabel>
                            </ScoreCircle>
                        </ScoreCircleWrapper>

                        <ScoreText>
                            You scored {percentage}% by correctly identifying {score} out of {scenarios.length} scam scenarios.
                        </ScoreText>
                    </ScoreContainer>

                    <ResultMessage percentage={percentage}>
                        <p>{getResultMessage()}</p>
                    </ResultMessage>

                    <WisdomQuote>
                        <WisdomText>{getRandomWisdom()}</WisdomText>
                    </WisdomQuote>

                    <ButtonContainer>
                        <Button primary onClick={handleReturn}>
                            Return to Original Site
                            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
                            </svg>
                        </Button>
                        <Button onClick={handleRestart}>
                            Continue Training
                            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z" />
                            </svg>
                        </Button>
                    </ButtonContainer>
                </CompletionCard>
            </CompletionContainer>
        </PageContainer>
    );
};

export default CompletionPage;