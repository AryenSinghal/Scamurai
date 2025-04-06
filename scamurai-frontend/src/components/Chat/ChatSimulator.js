import React from 'react';
import styled from 'styled-components';
import ChatMessage from './ChatMessage';

const ChatContainer = styled.div`
  background-color: #e5ded8;
  border: 1px solid #d1d7db;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
`;

const ChatHeader = styled.div`
  background-color: #00a884;
  color: white;
  padding: 12px 15px;
  display: flex;
  align-items: center;
`;

const ContactAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  font-weight: bold;
  color: #565656;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContactName = styled.div`
  font-weight: bold;
  font-size: 1rem;
`;

const ContactStatus = styled.div`
  font-size: 0.8rem;
  opacity: 0.8;
`;

const ChatMessages = styled.div`
  padding: 15px;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ChatInputArea = styled.div`
  display: flex;
  padding: 10px;
  background-color: #f0f2f5;
  border-top: 1px solid #e0e0e0;
`;

const ChatInput = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 20px;
  padding: 9px 12px;
  color: #999;
  font-size: 0.95rem;
`;

const parseMessages = (content) => {
  // Try to intelligently parse the content into messages
  const lines = content.split('\n');
  const messages = [];
  let currentMessage = { text: '' };
  let isSender = false; // Start with incoming message
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this line looks like a new message
    const timePattern = /\d{1,2}:\d{2}(:\d{2})?\s*(AM|PM|am|pm)?/;
    const namePattern = /^[A-Z][a-z]+:/;
    
    if (
      // If line starts with a name pattern like "John:"
      namePattern.test(line) ||
      // Or if line contains a time pattern
      timePattern.test(line) ||
      // Or if we're explicitly separating messages
      line === '---' ||
      // Or if it's a very short line that might be a separator
      (line.length < 10 && (
        line.includes('...') || 
        line.includes('---') ||
        line.includes('***')
      ))
    ) {
      // If we have text in the current message, save it and start a new one
      if (currentMessage.text) {
        messages.push({
          ...currentMessage,
          isSender
        });
        
        // Alternate between sender and receiver
        isSender = !isSender;
      }
      
      // Start a new message, removing any name prefix
      currentMessage = { 
        text: line.replace(namePattern, '').trim() 
      };
      
      // If it's just a separator, clear the text
      if (line === '---' || line.length < 10) {
        currentMessage.text = '';
      }
    } else {
      // Append to current message
      if (currentMessage.text) {
        currentMessage.text += ' ' + line;
      } else {
        currentMessage.text = line;
      }
    }
  }
  
  // Add the last message if it has text
  if (currentMessage.text) {
    messages.push({
      ...currentMessage,
      isSender
    });
  }
  
  // If we couldn't parse any messages, just put the whole content as one message
  if (messages.length === 0) {
    messages.push({
      text: content,
      isSender: false
    });
  }
  
  return messages;
};

const ChatSimulator = ({ content }) => {
  if (!content) return null;
  
  // Parse the content into messages
  const messages = parseMessages(content);
  
  // Get contact name from first message if it exists
  const getContactName = () => {
    const nameMatch = content.match(/^([A-Z][a-z]+):/m);
    return nameMatch ? nameMatch[1] : 'Unknown Contact';
  };
  
  const contactName = getContactName();
  const contactInitials = contactName.charAt(0).toUpperCase();
  
  return (
    <ChatContainer>
      <ChatHeader>
        <ContactAvatar>{contactInitials}</ContactAvatar>
        <ContactInfo>
          <ContactName>{contactName}</ContactName>
          <ContactStatus>online</ContactStatus>
        </ContactInfo>
      </ChatHeader>
      
      <ChatMessages>
        {messages.map((message, index) => (
          <ChatMessage 
            key={index}
            text={message.text}
            isSender={message.isSender}
            time={`${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`}
          />
        ))}
      </ChatMessages>
      
      <ChatInputArea>
        <ChatInput>Type a message</ChatInput>
      </ChatInputArea>
    </ChatContainer>
  );
};

export default ChatSimulator;