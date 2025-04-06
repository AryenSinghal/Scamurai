import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { TrainingContext } from '../contexts/TrainingContext';
import Header from '../components/Common/Header';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ChatSimulator from '../components/Chat/ChatSimulator';
import EmailSimulator from '../components/Email/EmailSimulator';
import MultipleChoice from '../components/Training/MultipleChoice';
import FeedbackPanel from '../components/Training/FeedbackPanel';

// Main container with wooden dojo background
const DojoContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 40px;
  font-family: var(--font-body);
  background: linear-gradient(45deg, var(--tatami-tan), var(--rice-paper));
  min-height: calc(100vh - 80px);
`;

// Inner container with rice paper texture
const DojoInner = styled.div`
  background-color: var(--rice-paper);
  border-radius: var(--radius-lg);
  padding: 30px;
  margin-top: 30px;
  box-shadow: var(--shadow-medium);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background-color: var(--primary);
  }
`;

// Samurai sensei section
const SenseiSection = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--tatami-tan);
`;

const SenseiAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--primary);
  margin-right: 20px;
  flex-shrink: 0;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
`;

const SenseiMessage = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: var(--radius-md);
  position: relative;
  box-shadow: var(--shadow-soft);
  
  &::before {
    content: "";
    position: absolute;
    top: 20px;
    left: -10px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid white;
  }
`;

const SenseiTitle = styled.h3`
  color: var(--primary);
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.4rem;
`;

const SenseiText = styled.p`
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-primary);
`;

// Scenario container styled like a tatami mat
const ScenarioContainer = styled.div`
  background-color: var(--tatami-tan);
  border-radius: var(--radius-md);
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: var(--shadow-soft);
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.1);
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/images/tatami-pattern.svg');
    background-repeat: repeat;
    opacity: 0.1;
    pointer-events: none;
    z-index: 1;
  }
`;

const ScenarioContent = styled.div`
  position: relative;
  z-index: 2;
`;

// Styled header for each scenario
const ScenarioHeader = styled.div`
  background-color: var(--primary);
  color: white;
  padding: 15px 20px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-soft);
`;

const ScenarioTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
`;

// Progress indicator with Japanese-inspired design
const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ProgressText = styled.div`
  font-size: 1rem;
  margin-right: 15px;
  color: rgba(255, 255, 255, 0.9);
`;

const ProgressDots = styled.div`
  display: flex;
`;

const ProgressDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.3)'};
  margin-right: 8px;
  transition: background-color 0.3s ease;
  
  &:last-child {
    margin-right: 0;
  }
`;

// Error message with Japanese-inspired design
const ErrorMessage = styled.div`
  background-color: var(--cherry-blossom);
  border-left: 5px solid var(--accent);
  padding: 20px;
  border-radius: var(--radius-md);
  margin: 30px 0;
  
  p {
    margin: 0;
    color: var(--accent);
    font-size: 1.1rem;
  }
`;

// Styling for the training module container
const TrainingModule = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: var(--shadow-soft);
`;

const DojoPage = () => {
    const {
        contentType,
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
            <>
                <Header />
                <DojoContainer>
                    <DojoInner>
                        <LoadingSpinner message="古き言葉の準備 (Preparing your training scenarios...)" />
                    </DojoInner>
                </DojoContainer>
            </>
        );
    }

    // Show error message if there was a problem
    if (error) {
        return (
            <>
                <Header />
                <DojoContainer>
                    <DojoInner>
                        <ErrorMessage>
                            <p>{error}</p>
                        </ErrorMessage>
                    </DojoInner>
                </DojoContainer>
            </>
        );
    }

    // If no content type or scenarios, show message
    if (!contentType || !scenarios || scenarios.length === 0) {
        return (
            <>
                <Header />
                <DojoContainer>
                    <DojoInner>
                        <ErrorMessage>
                            <p>No training scenarios available. Please start from the Scamurai extension.</p>
                        </ErrorMessage>
                    </DojoInner>
                </DojoContainer>
            </>
        );
    }

    // Helper function to get scenario-specific sensei messages
    const getSenseiMessage = () => {
        if (showFeedback) {
            return currentScenario.isScam
                ? "Remember, the scammer tries to create urgency or fear. A true warrior remains calm and observant."
                : "A wise samurai can distinguish between a real threat and a false alarm. Good observation!";
        }

        // Initial instruction message
        if (currentScenarioIndex === 0) {
            return "Welcome to the Scamurai Dojo! I will guide you through identifying online threats. Study each message carefully and decide if it's a genuine message or a dangerous scam.";
        }

        return "Consider the message carefully. Look for urgency tactics, unusual requests, or threats. Trust your instincts, but verify with evidence.";
    };

    return (
        <>
            <Header />
            <DojoContainer>
                <DojoInner>
                    <SenseiSection>
                        <SenseiAvatar>
                            👨‍🎓
                        </SenseiAvatar>
                        <SenseiMessage>
                            <SenseiTitle>Sensei Guidance:</SenseiTitle>
                            <SenseiText>{getSenseiMessage()}</SenseiText>
                        </SenseiMessage>
                    </SenseiSection>

                    <ScenarioContainer>
                        <ScenarioContent>
                            <ScenarioHeader>
                                <ScenarioTitle>
                                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M128 0c-17.6 0-32 14.4-32 32v480l128-64 128 64V32c0-17.6-14.4-32-32-32H128z" />
                                    </svg>
                                    Training Scenario {currentScenarioIndex + 1}
                                </ScenarioTitle>
                                <ProgressContainer>
                                    <ProgressText>
                                        Progress: {currentScenarioIndex + 1} / {scenarios.length}
                                    </ProgressText>
                                    <ProgressDots>
                                        {scenarios.map((_, index) => (
                                            <ProgressDot key={index} active={index <= currentScenarioIndex} />
                                        ))}
                                    </ProgressDots>
                                </ProgressContainer>
                            </ScenarioHeader>

                            <TrainingModule>
                                {/* Display the appropriate simulator based on content type */}
                                {contentType === 'chat' ? (
                                    <ChatSimulator content={currentScenario?.content} />
                                ) : (
                                    <EmailSimulator content={currentScenario?.content} />
                                )}
                            </TrainingModule>

                            {/* Multiple choice options */}
                            {!showFeedback && currentScenario && (
                                <MultipleChoice
                                    scenario={currentScenario}
                                    scenarioIndex={currentScenarioIndex}
                                />
                            )}

                            {/* Feedback after answering */}
                            {showFeedback && currentScenario && (
                                <FeedbackPanel
                                    scenario={currentScenario}
                                    scenarioIndex={currentScenarioIndex}
                                />
                            )}
                        </ScenarioContent>
                    </ScenarioContainer>
                </DojoInner>
            </DojoContainer>
        </>
    );
};

export default DojoPage;