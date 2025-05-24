import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface ClearChatButtonProps {
  onClearChat: () => void;
}

const ClearChatButton: React.FC<ClearChatButtonProps> = ({ onClearChat }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleClearClick = () => {
    if (showConfirm) {
      onClearChat();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };
  
  return (
    <div className="flex justify-center px-4 py-2">
      <button
        onClick={handleClearClick}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all
          ${showConfirm 
            ? 'bg-red-600 text-white hover:bg-red-700' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }
        `}
      >
        <Trash2 size={16} />
        {showConfirm ? 'Confirm Clear' : 'Clear Chat'}
      </button>
    </div>
  );
};

export default ClearChatButton;