import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  font-family: Arial, sans-serif;
`;

const MessageHeader = styled.div`
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const SenderInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const SenderAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  font-weight: bold;
  color: #757575;
`;

const SenderDetails = styled.div`
  flex: 1;
`;

const SenderName = styled.div`
  font-weight: bold;
  font-size: 1rem;
`;

const SenderEmail = styled.div`
  color: #757575;
  font-size: 0.9rem;
`;

const MessageDate = styled.div`
  color: #757575;
  font-size: 0.8rem;
  margin-left: auto;
`;

const MessageBody = styled.div`
  line-height: 1.6;
  font-size: 1rem;
  white-space: pre-wrap;
  color: #333;
`;

const EmailMessage = ({ sender, content }) => {
  // Extract name from email if possible
  const getNameFromEmail = (email) => {
    if (!email) return 'Unknown';
    
    // Try to extract name if it's in the format "Name <email@example.com>"
    const nameMatch = email.match(/^([^<]+)<.+>$/);
    if (nameMatch) {
      return nameMatch[1].trim();
    }
    
    // If it's just an email address, use the part before @
    if (email.includes('@')) {
      return email.split('@')[0].split('.').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    
    return email;
  };
  
  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const senderName = getNameFromEmail(sender);
  const initials = getInitials(senderName);
  
  // Generate a random date within the last week for realism
  const getRandomRecentDate = () => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 7); // 0-6 days ago
    const hoursAgo = Math.floor(Math.random() * 24); // 0-23 hours ago
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - hoursAgo);
    
    // Format the date
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  return (
    <MessageContainer>
      <MessageHeader>
        <SenderInfo>
          <SenderAvatar>{initials}</SenderAvatar>
          <SenderDetails>
            <SenderName>{senderName}</SenderName>
            <SenderEmail>{sender}</SenderEmail>
          </SenderDetails>
          <MessageDate>{getRandomRecentDate()}</MessageDate>
        </SenderInfo>
      </MessageHeader>
      
      <MessageBody>
        {content}
      </MessageBody>
    </MessageContainer>
  );
};

export default EmailMessage;