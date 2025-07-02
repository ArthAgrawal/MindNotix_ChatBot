import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MessageType } from '../components/ChatMessage';

export const useChatHistory = (
  isVoiceOn: boolean,
  language: 'en' | 'hi' | 'fr'
) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastBotMessage, setLastBotMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        const formattedMessages = parsedMessages.map((msg: any) => ({
          ...msg,
          id: msg.id || uuidv4(),
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(formattedMessages);
      } catch (err) {
        console.error('Error parsing chat history:', err);
        localStorage.removeItem('chatHistory');
      }
    } else {
      const welcomeMessage: MessageType = {
        id: uuidv4(),
        content:
          "Hello! I'm your AI Mentor. How can I help you with your career journey today?",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      localStorage.setItem('chatHistory', JSON.stringify([welcomeMessage]));
    }
  }, []);

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
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    return newMessage;
  };

  const clearMessages = () => {
    const welcomeMessage: MessageType = {
      id: uuidv4(),
      content:
        "Hello! I'm your AI Mentor. How can I help you with your career journey today?",
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);
    localStorage.setItem('chatHistory', JSON.stringify([welcomeMessage]));
  };

  const simulateBotResponse = async (userMessage: string) => {
    setIsLoading(true);

    // Language-specific system instructions
    const languageInstructions: Record<string, string> = {
      en: 'You are an experienced career mentor. Respond in fluent English. Be helpful, concise, and motivational. Keep answers short — maximum 3 to 4 bullet points or sentences only.',
      hi: 'आप एक अनुभवी करियर मेंटर हैं। उपयोगकर्ता को हिंदी में उत्तर दें। उत्तर संक्षिप्त और प्रेरणादायक होने चाहिए — अधिकतम 3 से 4 बिंदुओं में।',
      fr: 'Vous êtes un mentor de carrière expérimenté. Répondez en français. Soyez utile, motivant et concis — ne donnez que 3 ou 4 points ou phrases au maximum.',
    };
    

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: languageInstructions[language],
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) throw new Error('OpenAI API error');

      const data = await response.json();
      const botResponse = data.choices[0].message.content.trim();

      addMessage(botResponse, 'bot');
      setLastBotMessage(botResponse);

      // 🗣️ Speak if voice is on
      if (isVoiceOn && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(botResponse);

        // Set correct language code
        const langMap: Record<string, string> = {
          en: 'en-US',
          hi: 'hi-IN',
          fr: 'fr-FR',
        };
        utterance.lang = langMap[language] || 'en-US';
        utterance.rate = 1;

        // Optional: Select best voice if available
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find((v) => v.lang === utterance.lang);
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error generating bot response:', error);
      addMessage(
        "I'm sorry, I couldn't process your request. Please try again later.",
        'bot'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    addMessage,
    clearMessages,
    simulateBotResponse,
    lastBotMessage,
  };
};
