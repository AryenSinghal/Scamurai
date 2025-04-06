import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #ff5722;
  color: white;
  padding: 15px 0;
  margin-bottom: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
`;

const LogoIcon = styled.div`
  font-size: 1.8rem;
  margin-right: 10px;
  font-weight: bold;
`;

const LogoText = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Tagline = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  margin-left: 20px;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <LogoIcon>⚔️</LogoIcon>
          <LogoText>SCAMURAI DOJO</LogoText>
        </Logo>
        <Tagline>Training seniors to detect online scams</Tagline>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;