import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.isSender ? 'row-reverse' : 'row'};
  margin-bottom: 10px;
  max-width: 100%;
  align-items: flex-end;
`;

const MessageBubble = styled.div`
  background-color: ${props => props.isSender ? '#d9fdd3' : 'white'};
  padding: 8px 12px;
  border-radius: 7.5px;
  max-width: 65%;
  position: relative;
  box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: ${props => props.isSender ? '#d9fdd3' : 'white'};
    border-bottom: 0;
    margin-top: 0;
    
    ${props => props.isSender 
      ? 'right: -5px; border-left: 0;' 
      : 'left: -5px; border-right: 0;'
    }
  }
`;

const MessageText = styled.div`
  font-size: 0.95rem;
  color: #111b21;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const MessageTime = styled.div`
  font-size: 0.7rem;
  color: #667781;
  text-align: right;
  margin-top: 2px;
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const StatusTick = styled.div`
  margin-left: 3px;
  display: ${props => props.isSender ? 'inline' : 'none'};
  
  svg {
    width: 14px;
    height: 14px;
    fill: #53bdeb;
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
          style={{ color: '#039be5', textDecoration: 'underline' }}
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

const ChatMessage = ({ text, isSender, time }) => {
  return (
    <MessageContainer isSender={isSender}>
      <MessageBubble isSender={isSender}>
        <MessageText>
          {formatMessageWithLinks(text)}
        </MessageText>
        <MessageTime>
          {time}
          <StatusTick isSender={isSender}>
            <svg viewBox="0 0 16 15" width="16" height="15">
              <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
            </svg>
          </StatusTick>
        </MessageTime>
      </MessageBubble>
    </MessageContainer>
  );
};

export default ChatMessage;