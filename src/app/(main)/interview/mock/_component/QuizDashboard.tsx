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
import { generateQuizQuestions } from "../../../../../../actions/interview"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BarLoader } from "react-spinners"

const QuizDashboard = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<any[]>([])
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const {
    loading: generatingQuiz,
    fn: generateQuiz,
    data: quizData,
  } = useFetch(generateQuizQuestions)

  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
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

  const question = quizData[currentQuestion]

  //handling all the states and functions
  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = async () => {
    //TODO
  }


  const handleAnswer = (answer: any) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
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
          onClick={handleNextQuestion} className="">Next Question</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default QuizDashboard
