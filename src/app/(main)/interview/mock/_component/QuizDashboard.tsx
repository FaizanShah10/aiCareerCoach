"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import useFetch from "../../../../../../hooks/useFetch"
import { generateQuizQuestions, storeQuizQuestions } from "../../../../../../actions/interview"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BarLoader } from "react-spinners"
import { toast } from "sonner"
import QuizResult from "./QuizResult"

const QuizDashboard = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<any[]>([])
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  //Hook for Generating Quiz Questions
  const {
    loading: generatingQuiz,
    fn: generateQuiz,
    data: quizData,
  } = useFetch(generateQuizQuestions)

  
  //Hook for Storing Result of Quiz Questions
  const {
    loading: loadingQuizResult,
    fn: storeQuizResult,
    data: resultData,
    setData: setResultData,
  } = useFetch(storeQuizQuestions)

  const startNewQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setScore(0)
    setShowResult(false)
    setShowExplanation(false)
    generateQuiz()
  }

  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  if(resultData){
    return <QuizResult result={resultData} startNewQuiz={startNewQuiz}/>
  }

  if (!quizData) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Ready to start your quiz?</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Test your knowledge with industry-level interview questions.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={generateQuiz} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    )
  }

  console.log("Result Of Quiz: ", resultData)

  const question = quizData[currentQuestion]

  //handling all the states and functions
  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      finishQuiz()
    }
  }

  //function for calculating the score
  const calculateScore = () => {
    let score = 0;
    answers.forEach((userAnswer: string, index: number) => {
      if (userAnswer === quizData[index].correctAnswer) {
        score += 1;
      }
    });
    return (score / quizData.length) * 100;
  };


  const finishQuiz = async () => {
    const finalScore = calculateScore(); 
    try {
      await storeQuizResult(quizData, answers, finalScore);
      toast.success("Quiz Completed Successfully");
      setShowResult(true);
    } catch (error: any) {
      console.log("Error Storing the Score of Quiz", error.message);
    }
  };


  const handleAnswer = (answer: any) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer // user answer
    setAnswers(newAnswers)
  }



  return (
    <div className="w-full">
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
          className="space-y-2">
            {question.options.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button
          disabled={!answers[currentQuestion]} 
          onClick={handleNextQuestion} className="">
            {loadingQuizResult && ( <BarLoader className="mt-4" width={"100%"} color="gray" /> )}
            {currentQuestion < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default QuizDashboard
