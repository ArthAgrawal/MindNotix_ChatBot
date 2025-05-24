import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MessageType } from '../components/ChatMessage';

export const useChatHistory = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Ensure all messages have proper format and convert string dates to Date objects
        const formattedMessages = parsedMessages.map((msg: any) => ({
          ...msg,
          id: msg.id || uuidv4(),
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      } catch (err) {
        console.error('Error parsing chat history:', err);
        // If there's an error parsing, start with empty chat
        localStorage.removeItem('chatHistory');
      }
    } else {
      // Add welcome message if no history exists
      const welcomeMessage: MessageType = {
        id: uuidv4(),
        content: "Hello! I'm your AI Mentor. How can I help you with your career journey today?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      localStorage.setItem('chatHistory', JSON.stringify([welcomeMessage]));
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const addMessage = (content: string, sender: 'user' | 'bot') => {
    const newMessage: MessageType = {
      id: uuidv4(),
      content,
      sender,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  };

  const clearMessages = () => {
    // Keep only the welcome message
    const welcomeMessage: MessageType = {
      id: uuidv4(),
      content: "Hello! I'm your AI Mentor. How can I help you with your career journey today?",
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    localStorage.setItem('chatHistory', JSON.stringify([welcomeMessage]));
  };

  const simulateBotResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an experienced career mentor helping users in tech careers. Be helpful, concise, and motivational. Keep answers short and crisp and to the point."
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from OpenAI');
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content.trim();
      addMessage(botResponse, 'bot');
    } catch (error) {
      console.error('Error getting response:', error);
      addMessage("I'm sorry, I couldn't process your request. Please try again later.", 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    addMessage,
    clearMessages,
    simulateBotResponse
  };
};