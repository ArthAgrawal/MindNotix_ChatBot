import React, { useRef, useEffect } from 'react';
import ChatMessage, { MessageType } from './ChatMessage';
import TypingIndicator from './TypingIndicator';

interface ChatMessageListProps {
  messages: MessageType[];
  isTyping: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change or typing status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  return (
    <div className="messages-container custom-scrollbar">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      {isTyping && <TypingIndicator />}
      
      {/* Empty div for scrolling to bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;