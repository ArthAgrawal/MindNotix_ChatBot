import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatInput from './components/ChatInput';
import ChatMessageList from './components/ChatMessageList';
import PredefinedQuestions from './components/PredefinedQuestions';
import ClearChatButton from './components/ClearChatButton';
import { useChatHistory } from './hooks/useChatHistory';

// Predefined questions that can be customized
const PREDEFINED_QUESTIONS = [
  "How do I prepare for a data analyst interview?",
  "What skills do I need for software engineering?",
  "How to switch careers into tech?",
  "Tips for remote work productivity"
];

function App() {
  const { 
    messages, 
    isLoading, 
    addMessage, 
    clearMessages, 
    simulateBotResponse 
  } = useChatHistory();
  
  const handleSendMessage = async (message: string) => {
    // Add user message to the chat
    addMessage(message, 'user');
    
    // Get bot response
    await simulateBotResponse(message);
  };
  
  const handleSelectQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <div className="chat-container">
        <ChatHeader isOnline={true} />
        
        <ChatMessageList 
          messages={messages} 
          isTyping={isLoading} 
        />
        
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoading} 
        />
        
        <ClearChatButton onClearChat={clearMessages} />
        
        <PredefinedQuestions
          questions={PREDEFINED_QUESTIONS}
          onSelectQuestion={handleSelectQuestion}
        />
      </div>
    </div>
  );
}

export default App;