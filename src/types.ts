export interface Prefecture {
  name: string;
  teams: string[];
}

export interface QuizState {
  currentPrefectureIndex: number;
  userAnswers: string[][];
  quizCompleted: boolean;
  shuffledPrefectures: Prefecture[];
}

export interface QuizResults {
  prefecture: string;
  correctAnswers: string[];
  userAnswers: string[];
  results: boolean[];
}