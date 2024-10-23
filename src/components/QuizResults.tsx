import React from 'react';
import { QuizResults as QuizResultsType } from '../types';
import { Check, X } from 'lucide-react';

interface QuizResultsProps {
  results: QuizResultsType[];
}

const QuizResultsComponent: React.FC<QuizResultsProps> = ({ results }) => {
  const calculateTotalScore = (): { correct: number; total: number } => {
    let correct = 0;
    let total = 0;
    results.forEach(result => {
      correct += result.results.filter(Boolean).length;
      total += result.correctAnswers.length;
    });
    return { correct, total };
  };

  const { correct, total } = calculateTotalScore();
  const accuracy = ((correct / total) * 100).toFixed(2);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">クイズ結果</h2>
      <p className="mb-4">
        総合スコア: {correct}/{total} ({accuracy}%)
      </p>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">都道府県</th>
            <th className="border border-gray-300 px-4 py-2">正解</th>
            <th className="border border-gray-300 px-4 py-2">あなたの回答</th>
            <th className="border border-gray-300 px-4 py-2">結果</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            result.correctAnswers.map((team, teamIndex) => (
              <tr key={`${index}-${teamIndex}`}>
                {teamIndex === 0 && (
                  <td rowSpan={result.correctAnswers.length} className="border border-gray-300 px-4 py-2">
                    {result.prefecture}
                  </td>
                )}
                <td className="border border-gray-300 px-4 py-2">{team}</td>
                <td className="border border-gray-300 px-4 py-2">{result.userAnswers[teamIndex] || '-'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {result.results[teamIndex] ? (
                    <Check className="text-green-500 inline" />
                  ) : (
                    <X className="text-red-500 inline" />
                  )}
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizResultsComponent;