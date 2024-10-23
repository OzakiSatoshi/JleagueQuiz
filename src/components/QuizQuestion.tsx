import React, { useState, useEffect } from 'react';
import { Prefecture } from '../types';

interface QuizQuestionProps {
  prefecture: Prefecture;
  onAnswer: (answers: string[]) => void;
  onNext: () => void;
  onFinish: () => void;
  isLastQuestion: boolean;
  currentQuestion: number;
  totalQuestions: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  prefecture,
  onAnswer,
  onNext,
  onFinish,
  isLastQuestion,
  currentQuestion,
  totalQuestions
}) => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    // 新しい問題が表示されるたびに answers を初期化
    setAnswers(Array(prefecture.teams.length).fill(''));
    setAnswered(false);
  }, [prefecture]);

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnswer(answers);
    setAnswered(true);

    if (!isLastQuestion) {
      onNext();
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">{prefecture.name}</h2>
      <p className="mb-4">チーム数: {prefecture.teams.length}</p>
      <p className="mb-4">
        問題 {currentQuestion} / {totalQuestions}
      </p>
      <form onSubmit={handleSubmit}>
        {prefecture.teams.map((_, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              value={answers[index] || ''}
              onChange={(e) => handleInputChange(index, e.target.value)}
              disabled={answered}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={`チーム ${index + 1}`}
            />
          </div>
        ))}
        <div className="flex justify-between mt-4">
          {!answered && (
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              回答・次の問題へ
            </button>
          )}
          <button
            type="button"
            onClick={onFinish}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isLastQuestion ? 'クイズを終了して結果を見る' : '途中で終了して結果を見る'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizQuestion;