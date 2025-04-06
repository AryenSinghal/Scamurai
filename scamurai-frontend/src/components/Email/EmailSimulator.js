import React from 'react';
import styled from 'styled-components';
import EmailMessage from './EmailMessage';

const EmailContainer = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  font-family: Arial, sans-serif;
`;

const EmailHeader = styled.div`
  background-color: #f2f2f2;
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
`;

const EmailActions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const ActionButton = styled.button`
  background-color: ${props => props.primary ? '#4285f4' : '#f2f2f2'};
  color: ${props => props.primary ? 'white' : '#444'};
  border: 1px solid ${props => props.primary ? '#4285f4' : '#ddd'};
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.primary ? '#3b78e7' : '#e6e6e6'};
  }
`;

const EmailToolbar = styled.div`
  padding: 10px 15px;
  border-bottom: 1px solid #e0e0e0;
  background-color: white;
`;

const EmailContent = styled.div`
  padding: 20px;
  background-color: white;
  min-height: 200px;
`;

const EmailSubject = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const getSenderFromContent = (content) => {
  // Simple heuristic to extract a sender from the email content
  const lines = content.split('\n');
  
  // Look for lines that might contain "From:" or similar
  for (const line of lines) {
    if (line.toLowerCase().includes('from:')) {
      return line.replace(/from:/i, '').trim();
    }
  }
  
  // If no "From:" line found, try to find an email address
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  for (const line of lines) {
    const match = line.match(emailRegex);
    if (match) {
      return match[0];
    }
  }
  
  // Default sender if nothing found
  return 'unknown-sender@example.com';
};

const getSubjectFromContent = (content) => {
  // Simple heuristic to extract a subject from the email content
  const lines = content.split('\n');
  
  // Look for lines that might contain "Subject:" or similar
  for (const line of lines) {
    if (line.toLowerCase().includes('subject:')) {
      return line.replace(/subject:/i, '').trim();
    }
  }
  
  // Extract first non-empty line as subject if no explicit subject found
  for (const line of lines) {
    if (line.trim()) {
      return line.length > 60 ? line.substring(0, 57) + '...' : line;
    }
  }
  
  // Default subject if nothing found
  return 'No Subject';
};

const formatEmailBody = (content) => {
  // Remove common email headers if present
  let body = content;
  const headerPatterns = [
    /^from:.*?\n/i,
    /^to:.*?\n/i,
    /^subject:.*?\n/i,
    /^date:.*?\n/i,
    /^cc:.*?\n/i,
    /^bcc:.*?\n/i
  ];
  
  headerPatterns.forEach(pattern => {
    body = body.replace(pattern, '');
  });
  
  // Trim whitespace
  body = body.trim();
  
  return body;
};

const EmailSimulator = ({ content }) => {
  if (!content) return null;
  
  const sender = getSenderFromContent(content);
  const subject = getSubjectFromContent(content);
  const body = formatEmailBody(content);
  
  return (
    <EmailContainer>
      <EmailHeader>
        <img 
          src="https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_32dp.png" 
          alt="Email Icon" 
          style={{ marginRight: '10px', height: '24px' }}
        />
        <span style={{ fontWeight: 'bold' }}>Email Viewer</span>
      </EmailHeader>
      
      <EmailToolbar>
        <EmailActions>
          <ActionButton>Reply</ActionButton>
          <ActionButton>Forward</ActionButton>
          <ActionButton>Delete</ActionButton>
          <ActionButton primary>Mark as Spam</ActionButton>
        </EmailActions>
      </EmailToolbar>
      
      <EmailContent>
        <EmailSubject>{subject}</EmailSubject>
        <EmailMessage sender={sender} content={body} />
      </EmailContent>
    </EmailContainer>
  );
};

export default EmailSimulator;