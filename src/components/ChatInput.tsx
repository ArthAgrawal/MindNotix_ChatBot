import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }

  type SpeechRecognition = any;
  type SpeechRecognitionEvent = any;
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setMessage((prev) => prev + ' ' + transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition failed to start:', error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="w-full">
      <form 
        onSubmit={handleSubmit} 
        className="flex items-center gap-2 border-t border-gray-200 bg-white p-4"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={disabled ? "Chatbot is disabled..." : "Type or speak a message..."}
          disabled={disabled}
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
        />
        
        {/* 🎤 Microphone Button */}
        <button
          type="button"
          onClick={handleVoiceInput}
          disabled={disabled}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            isListening ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          } hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed`}
          title={isListening ? "Stop Listening" : "Start Voice Input"}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* 🚀 Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </form>

      {/* 🎙️ Listening indicator below input */}
      {isListening && (
        <div className="text-sm text-blue-500 ml-4 mt-1 animate-pulse">
          🎙️ Listening...
        </div>
      )}
    </div>
  );
};

export default ChatInput;
