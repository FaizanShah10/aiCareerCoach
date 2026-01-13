// types/assessment.ts

export type Question = {
  id: string; // REQUIRED everywhere
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  explanation?: string;
  isCorrect?: boolean;
};

export type Assessment = {
  id: string;
  quizScore: number;
  createdAt: Date;
  category: string;
  improvementTip?: string; 
  questions: Question[];
};
