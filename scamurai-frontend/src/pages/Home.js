import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Header from '../components/Common/Header';

const HomeContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const WelcomeCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  margin: 40px 0;
  text-align: center;
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

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 30px;
`;

const ButtonContainer = styled.div`
  margin-top: 30px;
`;

const Button = styled(Link)`
  background-color: #ff5722;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  
  &:hover {
    background-color: #e64a19;
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.div`
  margin: 50px 0;
`;

const FeatureTitle = styled.h3`
  font-size: 1.8rem;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
`;

const FeatureCard = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 15px;
`;

const FeatureName = styled.h4`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
`;

const Home = () => {
  return (
    <HomeContainer>
      <Header />
      
      <WelcomeCard>
        <Title>Welcome to Scamurai Dojo</Title>
        <Subtitle>Train your scam detection skills!</Subtitle>
        
        <Description>
          Scamurai Dojo is an educational platform designed to help you identify and avoid online scams. 
          Our interactive training exercises will teach you how to spot suspicious messages, emails, and websites.
        </Description>
        
        <ButtonContainer>
          <Button to="/dojo">Start Training</Button>
        </ButtonContainer>
      </WelcomeCard>
      
      <FeaturesSection>
        <FeatureTitle>What You'll Learn</FeatureTitle>
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>🔍</FeatureIcon>
            <FeatureName>Spot Warning Signs</FeatureName>
            <FeatureDescription>
              Learn to identify red flags in messages and emails that indicate potential scams.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>⚠️</FeatureIcon>
            <FeatureName>Recognize Urgency Tactics</FeatureName>
            <FeatureDescription>
              Understand how scammers create false urgency to pressure you into making quick decisions.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔗</FeatureIcon>
            <FeatureName>Verify Links</FeatureName>
            <FeatureDescription>
              Learn how to safely check links before clicking and avoid phishing attempts.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>💪</FeatureIcon>
            <FeatureName>Build Confidence</FeatureName>
            <FeatureDescription>
              Practice with realistic examples to build confidence in your ability to detect scams.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </FeaturesSection>
    </HomeContainer>
  );
};

export default Home;