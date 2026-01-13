"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

import QuizResult from "./QuizResult";
import {
  generateQuizQuestions,
  storeQuizQuestions,
} from "../../../../../../actions/interview";

/* ======================
   Types
====================== */

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type QuizResultData = {
  quizScore: number;
  improvementTip?: string;
  questions: QuizQuestion[];
};

/* ======================
   Component
====================== */

const QuizDashboard = () => {
  const [topic, setTopic] = useState("");
  const [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingQuizResult, setLoadingQuizResult] = useState(false);
  const [resultData, setResultData] = useState<QuizResultData | null>(null);

  const startNewQuiz = () => {
    setTopic("");
    setQuizData(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setResultData(null);
  };

  const handleStartQuiz = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for your quiz.");
      return;
    }

    try {
      setLoading(true);
      const questions = await generateQuizQuestions(topic);

      if (!questions || questions.length === 0) {
        toast.error("Could not generate questions. Try another topic.");
        return;
      }

      setQuizData(questions as QuizQuestion[]);
      toast.success("Quiz started!");
    } catch {
      toast.error("Failed to generate quiz questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answer;
    setAnswers(updatedAnswers);
  };

  const calculateScore = (): number => {
    if (!quizData) return 0;

    const correctCount = answers.reduce((acc, answer, index) => {
      return answer === quizData[index].correctAnswer ? acc + 1 : acc;
    }, 0);

    return (correctCount / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    if (!quizData) return;

    const finalScore = calculateScore();
    setLoadingQuizResult(true);

    try {
      const result = await storeQuizQuestions(
        quizData,
        answers,
        finalScore
      );

      setResultData({
        quizScore: result.quizScore,
        improvementTip: result.improvementTip || undefined,
        questions: result.questions as QuizQuestion[],
      });
      toast.success("Quiz completed successfully.");
    } catch {
      toast.error("Error saving quiz result.");
    } finally {
      setLoadingQuizResult(false);
    }
  };

  const handleNextQuestion = () => {
    if (!quizData) return;

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  /* ======================
     UI States
  ====================== */

  if (loading) {
    return <BarLoader className="mt-4" width="100%" color="gray" />;
  }

  if (resultData) {
    return <QuizResult result={resultData} startNewQuiz={startNewQuiz} />;
  }

  if (!quizData) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Ready to start your quiz?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Test your knowledge with industry-level interview questions.
          </p>
          <Input
            placeholder="Enter your desired topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartQuiz} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <Card className="max-w-lg w-full">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
        <CardDescription>{question.question}</CardDescription>
      </CardHeader>

      <CardContent>
        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {question.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>

      <CardFooter>
        <Button
          disabled={!answers[currentQuestion]}
          onClick={handleNextQuestion}
          className="w-full"
        >
          {loadingQuizResult ? (
            <BarLoader width="100%" color="gray" />
          ) : currentQuestion < quizData.length - 1 ? (
            "Next Question"
          ) : (
            "Finish Quiz"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizDashboard;
