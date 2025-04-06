import React from 'react';
import styled from 'styled-components';
import EmailMessage from './EmailMessage';

const EmailContainer = styled.div`
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: var(--shadow-soft);
  font-family: Arial, sans-serif;
  position: relative;
`;

const EmailHeader = styled.div`
  background-color: var(--primary);
  padding: 12px 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
`;

const EmailLogo = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  
  svg {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    fill: white;
  }
`;

const EmailToolbar = styled.div`
  padding: 10px 15px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f7f7f7;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: ${props => props.primary ? '#4285f4' : '#f2f2f2'};
  color: ${props => props.primary ? 'white' : '#555'};
  border: 1px solid ${props => props.primary ? '#4285f4' : '#ddd'};
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  svg {
    width: 18px;
    height: 18px;
    margin-right: 8px;
    fill: currentColor;
  }
  
  &:hover {
    background-color: ${props => props.primary ? '#3b78e7' : '#e6e6e6'};
  }
`;

const EmailContent = styled.div`
  padding: 25px;
  background-color: white;
  min-height: 250px;
`;

const EmailSubject = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 25px;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

// Helper functions to extract information from the email content
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
    return "unknown-sender@example.com";
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
    return "No Subject";
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
                <EmailLogo>
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M464 64C490.5 64 512 85.49 512 112C512 127.1 504.9 141.3 492.8 150.4L275.2 313.6C263.8 322.1 248.2 322.1 236.8 313.6L19.2 150.4C7.113 141.3 0 127.1 0 112C0 85.49 21.49 64 48 64H464zM217.6 339.2C240.4 356.3 271.6 356.3 294.4 339.2L512 176V384C512 419.3 483.3 448 448 448H64C28.65 448 0 419.3 0 384V176L217.6 339.2z" />
                    </svg>
                    Email Viewer
                </EmailLogo>
            </EmailHeader>

            <EmailToolbar>
                <ActionButton>
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M205.3 174.6c0 21.1-17.1 38.2-38.2 38.2s-38.2-17.1-38.2-38.2c0-21.1 17.1-38.2 38.2-38.2 21.1 0 38.2 17.1 38.2 38.2zM92.26 312.9c0-2.8 1-5.5 2.8-7.6l36.6-44c6.3-7.7 15.9-12.1 26-12.1h11.1c10.1 0 19.6 4.4 26 12.1l36.6 44c1.8 2.1 2.8 4.8 2.8 7.6 0 6.4-5.2 11.6-11.6 11.6H103.9c-6.4 0-11.6-5.2-11.6-11.6zM385.3 185.9c33.7 0 61.1-27.4 61.1-61.1s-27.4-61.1-61.1-61.1-61.1 27.4-61.1 61.1 27.4 61.1 61.1 61.1zM276.8 244.7l60.9-53.3c3.1-2.7 7.2-4.3 11.3-4.3 9.6 0 17.5 7.9 17.5 17.5v137c0 10.4-6.7 19.3-16 22.8l-69.9 25.9-14.3-38.5 45.7-17v-73l-35.2 30.9-27-31z" />
                    </svg>
                    Reply
                </ActionButton>
                <ActionButton>
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M307.8 146.2c3.5-8.3 12.9-12.6 21.5-9.5 14.7 5.4 27.9 13.4 39 23.8 11.1 10.3 19.9 22.5 26.3 35.6 6.3 13.2 9.5 27.1 9.5 41v32c0 8.8-7.2 16-16 16h-28.2c-5.9 9.6-13.5 18-22.5 24.5-3.1 2.2-5.6 5.4-6.8 9.1L309.9 371c-2.9 8.6-10.9 14.3-19.5 14.3h-42.9c-4.5 0-8.9-1.9-12-5.2-15-16.3-22.6-38-21.1-60.2 0-8.2 6.7-16.6 14.9-16.6h20.3c11 0 21.7-2.9 31.2-8.5 19.4-11.5 32.5-31.5 32.5-54.9 0-10.4-2.6-20.2-7.2-28.9-3-5.8-3.5-12.6-1.1-18.8l3.5-8.1zM0 192c0-35.3 28.7-64 64-64h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H64v224h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H64c-35.3 0-64-28.7-64-64V192zm493.3 159.3c-6.2 6.2-16.4 6.2-22.6 0l-25-25c-21 14.7-36.4 33.3-44.6 53.7h-30.9l3.9-11.7c2.5-7.5 7.1-14 13.2-18.4 10.4-7.5 24.5-12.9 40.6-12.9 12.8 0 38.5 0 42.7 0 2.1 0 4.1-0.8 5.6-2.3l3.5-3.5c6.2-6.2 16.4-6.2 22.6 0l25 25c6.2 6.2 6.2 16.4 0 22.6l-33.9 33.9zM384 192c0 53-43 96-96 96s-96-43-96-96 43-96 96-96 96 43 96 96zm32 0c0-70.7-57.3-128-128-128s-128 57.3-128 128 57.3 128 128 128 128-57.3 128-128z" />
                    </svg>
                    Forward
                </ActionButton>
                <ActionButton>
                    <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </svg>
                    Delete
                </ActionButton>
                <ActionButton primary>
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zm32 224c0 17.7-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32z" />
                    </svg>
                    Mark as Spam
                </ActionButton>
            </EmailToolbar>

            <EmailContent>
                <EmailSubject>{subject}</EmailSubject>
                <EmailMessage sender={sender} content={body} />
            </EmailContent>
        </EmailContainer>
    );
};

export default EmailSimulator;