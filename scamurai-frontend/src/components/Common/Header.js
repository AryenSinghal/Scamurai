import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: var(--indigo-blue);
  padding: 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  color: white;
`;

const LogoSymbol = styled.div`
  margin-right: 1rem;
  
  svg {
    width: 48px;
    height: 48px;
    fill: white;
  }
  
  @media (max-width: 768px) {
    margin-right: 0.5rem;
    
    svg {
      width: 36px;
      height: 36px;
    }
  }
`;

const LogoText = styled.div`
  font-family: var(--font-heading);
  font-weight: bold;
  
  h1 {
    margin: 0;
    font-size: 1.8rem;
    color: white;
    letter-spacing: 0.05em;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  p {
    margin: 0;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
`;

const TaglineContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  backdrop-filter: blur(5px);
  
  @media (max-width: 768px) {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
  }
`;

const Tagline = styled.div`
  font-size: 1.1rem;
  color: white;
  font-style: italic;
  position: relative;
  
  &::before {
    content: """;
    font-size: 1.5rem;
    position: relative;
    top: 0.2rem;
    margin-right: 0.2rem;
  }
  
  &::after {
    content: """;
    font-size: 1.5rem;
    position: relative;
    top: 0.2rem;
    margin-left: 0.2rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// Japanese-inspired pattern background
const HeaderPattern = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 50%;
  background: linear-gradient(135deg, rgba(38, 70, 83, 0.1) 25%, transparent 25%, transparent 50%, rgba(38, 70, 83, 0.1) 50%, rgba(38, 70, 83, 0.1) 75%, transparent 75%);
  background-size: 20px 20px;
  opacity: 0.1;
  z-index: 1;
`;

const Header = () => {
    return (
        <HeaderContainer>
            <HeaderPattern />
            <HeaderInner>
                <LogoContainer>
                    <Logo>
                        <LogoSymbol>
                            ⚔️
                        </LogoSymbol>
                        <LogoText>
                            <h1>SCAMURAI DOJO</h1>
                            <p>The Way of Digital Protection</p>
                        </LogoText>
                    </Logo>
                </LogoContainer>

                <TaglineContainer>
                    <Tagline>Training seniors to detect online scams</Tagline>
                </TaglineContainer>
            </HeaderInner>
        </HeaderContainer>
    );
};

export default Header;