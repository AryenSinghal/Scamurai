import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Header from '../components/Common/Header';

const HomeContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  font-family: var(--font-body);
  background-color: var(--rice-paper);
`;

const HeroBanner = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
              linear-gradient(to right, var(--primary), var(--accent));
  color: white;
  padding: 80px 20px 100px;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 2px);
    background-size: 15px 15px;
    opacity: 0.2;
    z-index: 0;
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 20px;
  color: white;
  font-family: var(--font-heading);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
  display: inline-block;
  
  &::before, &::after {
    content: "⦿";
    font-size: 1.5rem;
    color: var(--vermilion-red);
    position: relative;
    top: -1.5rem;
    margin: 0 10px;
  }
`;

const HeroSubtitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 40px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: normal;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const HeroCta = styled(Link)`
  background-color: var(--vermilion-red);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 15px 40px;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/images/japanese-pattern.svg');
    background-size: 100px;
    opacity: 0.1;
    z-index: -1;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background-color: #a70000;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    
    &::before {
      opacity: 0.2;
    }
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const MainContent = styled.div`
  padding: 80px 20px;
  background-color: var(--rice-paper);
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: -50px;
    left: 0;
    right: 0;
    height: 100px;
    background-color: var(--rice-paper);
    clip-path: polygon(0 50%, 100% 0, 100% 100%, 0% 100%);
    z-index: 1;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const IntroSection = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  padding: 50px;
  margin-bottom: 80px;
  box-shadow: var(--shadow-medium);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 8px;
    height: 100%;
    background-color: var(--primary);
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 40%;
    background-image: url('/images/samurai-silhouette.svg');
    background-size: contain;
    background-position: right center;
    background-repeat: no-repeat;
    opacity: 0.05;
    z-index: -1;
  }
`;

const IntroContent = styled.div`
  max-width: 70%;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.2rem;
  color: var(--primary);
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 15px;
  font-family: var(--font-heading);
  
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 80px;
    height: 3px;
    background-color: var(--accent);
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 30px;
`;

const FeaturesSection = styled.div`
  margin: 50px 0 80px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.8rem;
  color: var(--primary);
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  padding-bottom: 15px;
  font-family: var(--font-heading);
  
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 60px;
    height: 3px;
    background-color: var(--accent);
    transform: translateX(-50%);
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  padding: 30px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
  border-bottom: 3px solid ${props => props.color || 'var(--primary)'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background-color: ${props => props.color || 'var(--primary)'};
    opacity: 0.7;
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: ${props => props.color || 'var(--primary)'};
  
  svg {
    width: 64px;
    height: 64px;
    fill: currentColor;
  }
`;

const FeatureName = styled.h4`
  font-size: 1.4rem;
  color: var(--primary);
  margin-bottom: 15px;
  font-family: var(--font-heading);
`;

const FeatureDescription = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
`;

const WisdomSection = styled.div`
  background-color: var(--tatami-tan);
  padding: 60px 30px;
  border-radius: var(--radius-lg);
  margin-bottom: 80px;
  position: relative;
  box-shadow: var(--shadow-medium);
  
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
  }
`;

const WisdomContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const WisdomTitle = styled(SectionTitle)`
  text-align: center;
  color: var(--ink-black);
  
  &::after {
    left: 50%;
    transform: translateX(-50%);
  }
`;

const WisdomQuote = styled.div`
  font-size: 1.5rem;
  font-style: italic;
  line-height: 1.8;
  margin: 30px 0;
  color: var(--text-primary);
  position: relative;
  padding: 0 40px;
  
  &::before, &::after {
    content: """;
    font-size: 4rem;
    position: absolute;
    color: var(--primary);
    opacity: 0.3;
    font-family: serif;
    line-height: 1;
  }
  
  &::before {
    top: -20px;
    left: 0;
  }
  
  &::after {
    content: """;
    bottom: -40px;
    right: 0;
  }
`;

const CtaSection = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const CtaTitle = styled.h3`
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 30px;
  font-family: var(--font-heading);
`;

const CtaButton = styled(Link)`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 15px 40px;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  box-shadow: var(--shadow-medium);
  
  &:hover {
    background-color: #1a3547;
    transform: translateY(-3px);
    box-shadow: var(--shadow-hard);
  }
`;

const Home = () => {
    // Array of samurai wisdom quotes
    const samuraiWisdom = [
        "To know your enemy, you must become your enemy.",
        "The way of the warrior is to master the virtue of his weapons.",
        "When you see a suspicious message, hesitate before acting.",
        "The true victory is to see through the illusion of deception.",
        "From one sign, recognize ten thousand scams."
    ];

    // Get a random wisdom quote
    const getRandomWisdom = () => {
        const randomIndex = Math.floor(Math.random() * samuraiWisdom.length);
        return samuraiWisdom[randomIndex];
    };

    return (
        <HomeContainer>
            <Header />

            <HeroBanner>
                <HeroContent>
                    <HeroTitle>Scamurai Dojo</HeroTitle>
                    <HeroSubtitle>Master the ancient art of scam detection</HeroSubtitle>
                    <HeroCta to="/dojo">Begin Training</HeroCta>
                </HeroContent>
            </HeroBanner>

            <MainContent>
                <ContentContainer>
                    <IntroSection>
                        <IntroContent>
                            <SectionTitle>The Way of the Scamurai</SectionTitle>
                            <Description>
                                In today's digital age, the art of detecting online scams is an essential skill, especially for our elders. Scamurai Dojo is a training ground where you will learn to identify and defend against digital threats through interactive exercises and real-world examples.
                            </Description>
                            <Description>
                                Our training method blends ancient wisdom with modern knowledge, creating a simple yet powerful approach to recognizing deception. With practice, you will develop the instincts of a Scamurai - alert, discerning, and confident.
                            </Description>
                        </IntroContent>
                    </IntroSection>

                    <FeaturesSection>
                        <FeatureTitle>What You'll Learn</FeatureTitle>
                        <FeatureGrid>
                            <FeatureCard color="#c1121f">
                                <FeatureIcon color="#c1121f">
                                    ⚠️
                                </FeatureIcon>
                                <FeatureName>Spot Warning Signs</FeatureName>
                                <FeatureDescription>
                                    Learn to identify red flags in messages and emails that indicate potential scams.
                                </FeatureDescription>
                            </FeatureCard>

                            <FeatureCard color="#355e3b">
                                <FeatureIcon color="#355e3b">
                                    🛡️
                                </FeatureIcon>
                                <FeatureName>Cultivate Protection</FeatureName>
                                <FeatureDescription>
                                    Develop practical defensive habits that shield you from common online threats.
                                </FeatureDescription>
                            </FeatureCard>

                            <FeatureCard color="#264653">
                                <FeatureIcon color="#264653">
                                    👁️
                                </FeatureIcon>
                                <FeatureName>Sharpen Awareness</FeatureName>
                                <FeatureDescription>
                                    Enhance your ability to recognize suspicious patterns and tactics in digital communication.
                                </FeatureDescription>
                            </FeatureCard>

                            <FeatureCard color="#e9c46a">
                                <FeatureIcon color="#e9c46a">
                                    ⭐
                                </FeatureIcon>
                                <FeatureName>Build Confidence</FeatureName>
                                <FeatureDescription>
                                    Practice with realistic examples to build confidence in your ability to detect scams.
                                </FeatureDescription>
                            </FeatureCard>
                        </FeatureGrid>
                    </FeaturesSection>

                    <WisdomSection>
                        <WisdomContainer>
                            <WisdomTitle>Scamurai Wisdom</WisdomTitle>
                            <WisdomQuote>
                                {getRandomWisdom()}
                            </WisdomQuote>
                        </WisdomContainer>
                    </WisdomSection>

                    <CtaSection>
                        <CtaTitle>Ready to become a Scamurai?</CtaTitle>
                        <CtaButton to="/dojo">Enter the Dojo</CtaButton>
                    </CtaSection>
                </ContentContainer>
            </MainContent>
        </HomeContainer>
    );
};

export default Home;