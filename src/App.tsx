import React, { useState, useEffect } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatInput from './components/ChatInput';
import ChatMessageList from './components/ChatMessageList';
import PredefinedQuestions from './components/PredefinedQuestions';
import ClearChatButton from './components/ClearChatButton';
import { useChatHistory } from './hooks/useChatHistory';

const PREDEFINED_QUESTIONS = [
  "How do I prepare for a data analyst interview?",
  "What skills do I need for software engineering?",
  "How to switch careers into tech?",
  "Tips for remote work productivity"
];

function App() {
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'fr'>('en');

  const {
    messages,
    isLoading,
    addMessage,
    clearMessages,
    simulateBotResponse,
    lastBotMessage
  } = useChatHistory(isVoiceOn, selectedLanguage);

  // Replay the last bot message if voice was turned back on
  useEffect(() => {
    if (isVoiceOn && lastBotMessage && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(lastBotMessage);
      const langMap: Record<string, string> = {
        en: 'en-US',
        hi: 'hi-IN',
        fr: 'fr-FR',
      };
      utterance.lang = langMap[selectedLanguage] || 'en-US';
      utterance.rate = 1;
      speechSynthesis.speak(utterance);
    }
  }, [isVoiceOn]);

  const handleSendMessage = async (message: string) => {
    addMessage(message, 'user');
    await simulateBotResponse(message);
  };

  const handleSelectQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <div className="chat-container w-full max-w-2xl bg-white rounded-xl shadow-md p-4">

        {/* Header Row with Toggle & Language */}
        <div className="flex justify-between items-center mb-2">
          <ChatHeader isOnline={true} />

          <div className="flex gap-2 items-center">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'hi' | 'fr')}
              className="text-sm px-2 py-1 border rounded"
            >
              <option value="en">🇺🇸 English</option>
              <option value="hi">🇮🇳 Hindi</option>
              <option value="fr">🇫🇷 French</option>
            </select>

            <button
              onClick={() => {
                if (isVoiceOn && 'speechSynthesis' in window) {
                  speechSynthesis.cancel();
                }
                setIsVoiceOn(prev => !prev);
              }}
              className={`px-3 py-1 rounded text-sm font-medium ${
                isVoiceOn ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
              }`}
            >
              {isVoiceOn ? '🔊 Voice On' : '🔇 Voice Off'}
            </button>
          </div>
        </div>

        <ChatMessageList messages={messages} isTyping={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        <ClearChatButton onClearChat={clearMessages} />
        <PredefinedQuestions questions={PREDEFINED_QUESTIONS} onSelectQuestion={handleSelectQuestion} />
      </div>
    </div>
  );
}

export default App;
