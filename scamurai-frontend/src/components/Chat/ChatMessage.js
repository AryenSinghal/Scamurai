import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.isSender ? 'row-reverse' : 'row'};
  margin-bottom: 15px;
  max-width: 100%;
  align-items: flex-end;
  position: relative;
  z-index: 1;
`;

const MessageBubble = styled.div`
  background-color: ${props => props.isSender ? '#dcf8c6' : 'white'};
  padding: 10px 15px;
  border-radius: 10px;
  max-width: 70%;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.isSender ? '#c5e1a5' : '#e5e5e5'};
  
  /* Add a subtle arrow effect */
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    width: 0;
    height: 0;
    border: 8px solid transparent;
    
    ${props => props.isSender
        ? 'right: -16px; border-left-color: #dcf8c6; border-right: 0;'
        : 'left: -16px; border-right-color: white; border-left: 0;'
    }
  }
`;

const MessageText = styled.div`
  font-size: 1rem;
  color: var(--text-primary);
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  
  /* Style for links in messages */
  a {
    color: #0288d1;
    text-decoration: none;
    border-bottom: 1px dotted #0288d1;
    
    &:hover {
      border-bottom: 1px solid #0288d1;
    }
  }
`;

const MessageMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.isSender ? 'flex-end' : 'flex-start'};
  margin-top: 5px;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: #8696a0;
  margin-right: ${props => props.isSender ? '0' : '5px'};
  margin-left: ${props => props.isSender ? '5px' : '0'};
`;

const StatusIndicator = styled.div`
  display: ${props => props.isSender ? 'flex' : 'none'};
  align-items: center;
  
  svg {
    width: 16px;
    height: 16px;
    fill: ${props => props.read ? '#53bdeb' : '#a5a5a5'};
  }
`;

// Function to identify and format URLs in message text
const formatMessageWithLinks = (text) => {
    if (!text) return '';

    // Regular expression to identify URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split the text by URLs
    const parts = text.split(urlRegex);

    // Find all URLs in the text
    const urls = text.match(urlRegex) || [];

    // Combine parts and URLs, wrapping URLs in styled spans
    const result = [];
    parts.forEach((part, index) => {
        result.push(part);
        if (urls[index]) {
            result.push(
                <a
                    key={index}
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        // Could add warning/confirmation here in a real app
                    }}
                >
                    {urls[index]}
                </a>
            );
        }
    });

    return result;
};

// Random function to determine if message is "read"
const isMessageRead = () => {
    return Math.random() > 0.3;
};

const ChatMessage = ({ text, isSender, time }) => {
    const messageRead = isMessageRead();

    return (
        <MessageContainer isSender={isSender}>
            <MessageBubble isSender={isSender}>
                <MessageText>
                    {formatMessageWithLinks(text)}
                </MessageText>
                <MessageMeta isSender={isSender}>
                    <MessageTime isSender={isSender}>
                        {time}
                    </MessageTime>
                    <StatusIndicator isSender={isSender} read={messageRead}>
                        {messageRead ? (
                            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M374.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 178.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160zm-45.3 192L192 415.9l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                            </svg>
                        )}
                    </StatusIndicator>
                </MessageMeta>
            </MessageBubble>
        </MessageContainer>
    );
};

export default ChatMessage;