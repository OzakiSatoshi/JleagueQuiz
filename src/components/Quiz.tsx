import React, { useState, useEffect } from 'react';
import { prefectureData } from '../data/teamData';
import { QuizState, QuizResults, Prefecture } from '../types';
import QuizQuestion from './QuizQuestion';
import QuizResultsComponent from './QuizResults';
import { Share2 } from 'lucide-react';

const Quiz: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentPrefectureIndex: 0,
    userAnswers: [],
    quizCompleted: false,
    shuffledPrefectures: [],
  });

  const [quizResults, setQuizResults] = useState<QuizResults[]>([]);

  useEffect(() => {
    const shuffled = [...prefectureData].sort(() => Math.random() - 0.5);
    setQuizState(prevState => ({
      ...prevState,
      shuffledPrefectures: shuffled,
    }));
  }, []);

  const normalizeTeamName = (name: string): string => {
    const normalized = name.toLowerCase()
      .replace(/[・.．]/g, '')
      .replace(/\s+/g, '');

    // 特別な正規化ルール
    const specialCases: { [key: string]: string[] } = {
      '浦和レッズ': ['浦和レッドダイヤモンズ', '浦和レッズ'],
      '名古屋グランパス': ['名古屋グランパスエイト', '名古屋グランパス']
    };

    for (const [standardName, variations] of Object.entries(specialCases)) {
      const normalizedVariations = variations.map(v => 
        v.toLowerCase().replace(/[・.．]/g, '').replace(/\s+/g, '')
      );
      if (normalizedVariations.includes(normalized)) {
        return standardName.toLowerCase().replace(/[・.．]/g, '').replace(/\s+/g, '');
      }
    }

    return normalized;
  };

  const handleAnswer = (answers: string[]) => {
    const currentPrefecture = quizState.shuffledPrefectures[quizState.currentPrefectureIndex];
    const correctAnswers = currentPrefecture.teams;
    
    // 正規化された回答と正解のセットを作成
    const normalizedUserAnswers = answers.map(a => normalizeTeamName(a));
    const normalizedCorrectAnswers = correctAnswers.map(a => normalizeTeamName(a));
    
    // 各回答について、正規化された正解リストに含まれているかチェック
    const results = normalizedUserAnswers.map(userAnswer => {
      if (!userAnswer) return false; // 空の回答は不正解
      return normalizedCorrectAnswers.includes(userAnswer);
    });

    // 重複回答のチェック
    const uniqueAnswers = new Set(normalizedUserAnswers.filter(a => a));
    if (uniqueAnswers.size < normalizedUserAnswers.filter(a => a).length) {
      // 重複がある場合、重複している回答を不正解とする
      const seen = new Set<string>();
      results.forEach((_, index) => {
        const answer = normalizedUserAnswers[index];
        if (answer && seen.has(answer)) {
          results[index] = false;
        }
        seen.add(answer);
      });
    }

    const newResult: QuizResults = {
      prefecture: currentPrefecture.name,
      correctAnswers,
      userAnswers: answers,
      results,
    };

    setQuizResults(prevResults => [...prevResults, newResult]);
    setQuizState(prevState => ({
      ...prevState,
      userAnswers: [...prevState.userAnswers, answers],
    }));
  };

  const handleNext = () => {
    setQuizState(prevState => ({
      ...prevState,
      currentPrefectureIndex: prevState.currentPrefectureIndex + 1,
    }));
  };

  const handleFinish = () => {
    setQuizState(prevState => ({
      ...prevState,
      quizCompleted: true,
    }));
  };

  const handleShareResults = () => {
    const shareText = `Jリーグクイズの結果!\nスコア: ${calculateTotalScore().correct}/${calculateTotalScore().total}\n`;
    navigator.clipboard.writeText(shareText).then(() => {
      alert('結果をクリップボードにコピーしました！');
    });
  };

  const calculateTotalScore = (): { correct: number; total: number } => {
    let correct = 0;
    let total = 0;
    quizResults.forEach(result => {
      correct += result.results.filter(Boolean).length;
      total += result.correctAnswers.length;
    });
    return { correct, total };
  };

  if (quizState.quizCompleted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">クイズ結果</h1>
        <QuizResultsComponent results={quizResults} />
        <div className="mt-6">
          <button
            onClick={handleShareResults}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <Share2 className="mr-2" />
            結果をシェア
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Jリーグクイズ</h1>
      {quizState.shuffledPrefectures.length > 0 && (
        <QuizQuestion
          prefecture={quizState.shuffledPrefectures[quizState.currentPrefectureIndex]}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onFinish={handleFinish}
          isLastQuestion={quizState.currentPrefectureIndex === quizState.shuffledPrefectures.length - 1}
          currentQuestion={quizState.currentPrefectureIndex + 1}
          totalQuestions={quizState.shuffledPrefectures.length}
        />
      )}
    </div>
  );
};

export default Quiz;