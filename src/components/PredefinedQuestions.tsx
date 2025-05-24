import React from 'react';

interface PredefinedQuestionsProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
}

const PredefinedQuestions: React.FC<PredefinedQuestionsProps> = ({ 
  questions, 
  onSelectQuestion 
}) => {
  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-xs font-semibold text-gray-500 uppercase">
        Suggested Questions
      </h3>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-md active:bg-blue-800"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PredefinedQuestions;