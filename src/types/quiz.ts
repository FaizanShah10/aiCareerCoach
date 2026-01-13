export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export type ReviewedQuestion = QuizQuestion & {
  userAnswer: string;
  explanation: string;
  isCorrect: boolean;
};

export type QuizResultData = {
  quizScore: number;
  improvementTip?: string;
  questions: ReviewedQuestion[];
};
