import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  font-family: Arial, sans-serif;
`;

const MessageHeader = styled.div`
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: flex-start;
`;

const SenderInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const SenderAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  font-weight: bold;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const SenderDetails = styled.div`
  flex: 1;
`;

const SenderName = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 3px;
`;

const SenderEmail = styled.div`
  color: var(--text-secondary);
  font-size: 0.95rem;
`;

const MessageDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
`;

const MessageDate = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const SecurityIndicator = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: ${props => props.secure ? 'var(--bamboo-green)' : 'var(--text-secondary)'};
  
  svg {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    fill: currentColor;
  }
`;

const MessageBody = styled.div`
  line-height: 1.7;
  font-size: 1.1rem;
  white-space: pre-wrap;
  color: var(--text-primary);
  
  /* Increase spacing between paragraphs for readability */
  p {
    margin-bottom: 1.2em;
  }
  
  /* Style links in emails */
  a {
    color: #2b6cb0;
    text-decoration: underline;
    
    &:hover {
      text-decoration: none;
    }
  }
  
  /* Style any lists that might appear */
  ul, ol {
    margin: 1em 0;
    padding-left: 2em;
  }
  
  /* Add a bit more emphasis to bold text */
  strong, b {
    color: #000;
  }
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

    // Generate a random email security status
    const getRandomSecurityStatus = () => {
        return Math.random() > 0.5;
    };

    const senderName = getNameFromEmail(sender);
    const initials = getInitials(senderName);
    const isSecure = getRandomSecurityStatus();

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

    // Format email content with links
    const formatEmailContent = (text) => {
        if (!text) return '';

        // Replace URLs with linked versions
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, url => `<a href="#" onClick="event.preventDefault()">${url}</a>`);
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
                </SenderInfo>
                <MessageDetails>
                    <MessageDate>{getRandomRecentDate()}</MessageDate>
                    <SecurityIndicator secure={isSecure}>
                        {isSecure ? (
                            <>
                                <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
                                </svg>
                                Secure
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M144 144c0-44.2 35.8-80 80-80s80 35.8 80 80v48h64c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H80c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64h64v-48zm128 48V144c0-26.5-21.5-48-48-48s-48 21.5-48 48v48h96zm-320 64v192c0 17.7 14.3 32 32 32h384c17.7 0 32-14.3 32-32V256c0-17.7-14.3-32-32-32H384 64c-17.7 0-32 14.3-32 32z" />
                                </svg>
                                Unverified
                            </>
                        )}
                    </SecurityIndicator>
                </MessageDetails>
            </MessageHeader>

            <MessageBody dangerouslySetInnerHTML={{ __html: formatEmailContent(content) }} />
        </MessageContainer>
    );
};

export default EmailMessage;