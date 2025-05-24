import React from 'react';
import { Bot, Menu, MoreVertical } from 'lucide-react';

interface ChatHeaderProps {
  isOnline?: boolean;
  lastActive?: Date;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  isOnline = true, 
  lastActive = new Date() 
}) => {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600">
          <Bot className="h-6 w-6 text-white" />
        </div>
        
        <div>
          <h1 className="text-lg font-bold text-gray-800">AI Mentor</h1>
          <div className="flex items-center gap-2">
            <span 
              className={`inline-block h-2 w-2 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            <span className="text-xs text-gray-500">
              {isOnline ? 'Online' : 'Last active 5m ago'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button 
          className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Menu"
        >
          <Menu size={20} />
        </button>
        <button 
          className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="More options"
        >
          <MoreVertical size={20} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;