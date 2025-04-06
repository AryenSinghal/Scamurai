import React from 'react';
import styled from 'styled-components';
import ChatMessage from './ChatMessage';

const ChatContainer = styled.div`
  background-color: #e5ded8;
  border: 1px solid #d1d7db;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  box-shadow: var(--shadow-soft);
`;

const ChatHeader = styled.div`
  background-color: var(--primary);
  color: white;
  padding: 12px 15px;
  display: flex;
  align-items: center;
`;

const ContactAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  font-weight: bold;
  color: white;
  font-size: 1.2rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ContactName = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
`;

const ContactStatus = styled.div`
  font-size: 0.8rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  
  svg {
    width: 12px;
    height: 12px;
    margin-right: 5px;
    fill: currentColor;
  }
`;

const ChatActions = styled.div`
  display: flex;
  gap: 15px;
`;

const ActionIcon = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  
  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
  
  &:hover {
    opacity: 0.8;
  }
`;

const ChatMessages = styled.div`
  padding: 15px;
  min-height: 250px;
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-image: url('/images/chat-background-pattern.svg');
  background-repeat: repeat;
  background-size: 400px;
  background-color: rgba(229, 222, 216, 0.9);
`;

const ChatInputArea = styled.div`
  display: flex;
  padding: 10px;
  background-color: #f0f2f5;
  border-top: 1px solid #e0e0e0;
  align-items: center;
`;

const ChatInput = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 20px;
  padding: 12px 15px;
  color: #999;
  font-size: 1rem;
  margin: 0 10px;
`;

const InputIcon = styled.div`
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
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

    // Generate random times for messages
    const generateRandomTime = (index) => {
        const hour = Math.floor(Math.random() * 12) + 1;
        const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
        const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
        return `${hour}:${minute} ${ampm}`;
    };

    return (
        <ChatContainer>
            <ChatHeader>
                <ContactAvatar>{contactInitials}</ContactAvatar>
                <ContactInfo>
                    <ContactName>{contactName}</ContactName>
                    <ContactStatus>
                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                        </svg>
                        online
                    </ContactStatus>
                </ContactInfo>
                <ChatActions>
                    <ActionIcon>
                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167.4c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                        </svg>
                    </ActionIcon>
                    <ActionIcon>
                        <svg viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64v208c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zm162.7 75.3c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L185.4 272 140.1 317.4c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L208 294.6l45.4 45.4c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L230.6 272l45.4-45.4c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L208 249.4l-45.4-45.4zM512 128v64h-64V128H512zm-48 88c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H512v64c0 13.3-10.7 24-24 24s-24-10.7-24-24V328H400c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V216z" />
                        </svg>
                    </ActionIcon>
                    <ActionIcon>
                        <svg viewBox="0 0 128 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M64 360c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm0-160c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zM120 96c0 30.9-25.1 56-56 56S8 126.9 8 96S33.1 40 64 40s56 25.1 56 56z" />
                        </svg>
                    </ActionIcon>
                </ChatActions>
            </ChatHeader>

            <ChatMessages>
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        text={message.text}
                        isSender={message.isSender}
                        time={generateRandomTime(index)}
                    />
                ))}
            </ChatMessages>

            <ChatInputArea>
                <InputIcon>
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                    </svg>
                </InputIcon>
                <ChatInput>Type a message</ChatInput>
                <InputIcon>
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                    </svg>
                </InputIcon>
            </ChatInputArea>
        </ChatContainer>
    );
};

export default ChatSimulator;