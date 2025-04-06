import React, { useContext } from 'react';
import styled from 'styled-components';
import { TrainingContext } from '../../contexts/TrainingContext';

const FeedbackContainer = styled.div`
  margin-top: 30px;
  padding: 0;
  border-radius: var(--radius-md);
  background-color: white;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 25px;
  background-color: ${props => props.isCorrect ? 'var(--bamboo-green)' : 'var(--accent)'};
  color: white;
`;

const ResultIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  margin-right: 20px;
  flex-shrink: 0;
  
  svg {
    width: 30px;
    height: 30px;
    fill: currentColor;
  }
`;

const ResultTextContainer = styled.div`
  flex: 1;
`;

const ResultText = styled.h3`
  font-size: 1.6rem;
  margin: 0;
  color: white;
  font-family: var(--font-heading);
`;

const ResultSubtext = styled.p`
  font-size: 1rem;
  margin: 5px 0 0;
  color: rgba(255, 255, 255, 0.9);
`;

const FeedbackContent = styled.div`
  padding: 25px;
`;

const SenseiWisdom = styled.div`
  background-color: var(--rice-paper);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 25px;
  position: relative;
  border-left: 4px solid var(--primary);
`;

const WisdomTitle = styled.h4`
  color: var(--primary);
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  
  svg {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    fill: var(--primary);
  }
`;

const WisdomText = styled.p`
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.6;
  font-style: italic;
  color: var(--text-primary);
  
  &::before {
    content: """;
    font-size: 1.5rem;
    position: relative;
    top: 0.2rem;
  }
  
  &::after {
    content: """;
    font-size: 1.5rem;
    position: relative;
    top: 0.2rem;
  }
`;

const ExplanationText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 20px;
`;

const SelectedOption = styled.div`
  background-color: var(--rice-paper);
  padding: 15px 20px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  border-left: 4px solid ${props => props.isScam ? 'var(--accent)' : 'var(--bamboo-green)'};
`;

const OptionLabel = styled.div`
  font-weight: bold;
  margin-right: 15px;
  color: var(--text-primary);
  font-size: 1.1rem;
`;

const OptionValue = styled.div`
  padding: 5px 15px;
  border-radius: 20px;
  background-color: ${props => props.isScam ? 'rgba(193, 18, 31, 0.1)' : 'rgba(53, 94, 59, 0.1)'};
  color: ${props => props.isScam ? 'var(--accent)' : 'var(--bamboo-green)'};
  font-weight: bold;
  display: flex;
  align-items: center;
  
  svg {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    fill: currentColor;
  }
`;

const CorrectOption = styled.div`
  background-color: rgba(53, 94, 59, 0.05);
  padding: 15px 20px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  border-left: 4px solid var(--bamboo-green);
  display: flex;
  align-items: center;
`;

const NextButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const NextButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-soft);
  
  &:hover {
    background-color: #1a3547;
    transform: translateY(-3px);
    box-shadow: var(--shadow-medium);
  }
  
  svg {
    width: 20px;
    height: 20px;
    margin-left: 10px;
    fill: currentColor;
  }
`;

// Collection of samurai wisdom quotes
const samuraiWisdom = [
    "Not knowing is temporary. Not asking is permanent.",
    "The way of the warrior is to master the virtue of his weapons.",
    "Perceive that which cannot be seen with the eye.",
    "Study strategy over the years and achieve the spirit of the warrior.",
    "In true vision there is no beginning or end.",
    "Master the way, and victory is certain.",
    "The way of the samurai is in desperateness. Transcend life and death."
];

// Get a random wisdom quote
const getRandomWisdom = () => {
    const randomIndex = Math.floor(Math.random() * samuraiWisdom.length);
    return samuraiWisdom[randomIndex];
};

const FeedbackPanel = ({ scenario, scenarioIndex }) => {
    const { selectedOptions, goToNextScenario } = useContext(TrainingContext);

    // Get the user's selected option (now a boolean)
    const userSelection = selectedOptions[scenarioIndex];

    // Check if the selection was correct
    const isCorrect = userSelection === scenario.isScam;

    return (
        <FeedbackContainer>
            <ResultHeader isCorrect={isCorrect}>
                <ResultIcon>
                    {isCorrect ? (
                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
                        </svg>
                    )}
                </ResultIcon>
                <ResultTextContainer>
                    <ResultText>
                        {isCorrect ? 'Excellent, young warrior!' : 'Not quite right'}
                    </ResultText>
                    <ResultSubtext>
                        {isCorrect
                            ? 'You have shown the discernment of a true Scamurai.'
                            : 'The path to wisdom includes learning from missteps.'}
                    </ResultSubtext>
                </ResultTextContainer>
            </ResultHeader>

            <FeedbackContent>
                <SenseiWisdom>
                    <WisdomTitle>
                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z" />
                        </svg>
                        Sensei Wisdom
                    </WisdomTitle>
                    <WisdomText>{getRandomWisdom()}</WisdomText>
                </SenseiWisdom>

                <ExplanationText>
                    {scenario.explanation}
                </ExplanationText>

                {!isCorrect && (
                    <>
                        <SelectedOption isScam={userSelection}>
                            <OptionLabel>You selected:</OptionLabel>
                            <OptionValue isScam={userSelection}>
                                {userSelection ? (
                                    <>
                                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-24 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z" />
                                        </svg>
                                        Scam
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z" />
                                        </svg>
                                        Safe
                                    </>
                                )}
                            </OptionValue>
                        </SelectedOption>

                        <CorrectOption>
                            <OptionLabel>Correct answer:</OptionLabel>
                            <OptionValue isScam={scenario.isScam}>
                                {scenario.isScam ? (
                                    <>
                                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-24 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z" />
                                        </svg>
                                        Scam
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z" />
                                        </svg>
                                        Safe
                                    </>
                                )}
                            </OptionValue>
                        </CorrectOption>
                    </>
                )}

                <NextButtonContainer>
                    <NextButton onClick={goToNextScenario}>
                        {scenarioIndex < 3 ? 'Continue Training' : 'View Results'}
                        <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                        </svg>
                    </NextButton>
                </NextButtonContainer>
            </FeedbackContent>
        </FeedbackContainer>
    );
};

export default FeedbackPanel;