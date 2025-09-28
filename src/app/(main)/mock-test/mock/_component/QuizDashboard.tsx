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
import { generateQuizQuestions, storeQuizQuestions } from "../../../../../../actions/interview"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BarLoader } from "react-spinners"
import { toast } from "sonner"
import QuizResult from "./QuizResult"
import { Input } from "@/components/ui/input"

const QuizDashboard = () => {
  const [topic, setTopic] = useState("")
  const [quizData, setQuizData] = useState<any[] | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<any[]>([])
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingQuizResult, setLoadingQuizResult] = useState(false)
  const [resultData, setResultData] = useState<any | null>(null)

  const startNewQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setScore(0)
    setShowResult(false)
    setResultData(null)
    setQuizData(null)
    setTopic("")
  }

  const handleStartQuiz = async () => {
  if (!topic.trim()) {
    toast.error("Please enter a topic for your quiz.")
    return
  }

  // Validation for correct topic Input
  if (topic.length < 3 || !/[a-zA-Z]/.test(topic) || /\d/.test(topic)) {
    toast.error("Please enter a meaningful topic name.")
    return
  }

  try {
    setLoading(true)
    const questions = await generateQuizQuestions(topic)
    if (!questions || questions.length === 0) {
      toast.error("Could not generate questions for this topic. Try another one.")
      return
    }
    setQuizData(questions)
    toast.success("Quiz started!")
  } catch (err) {
    toast.error("Failed to generate quiz questions. Try another topic.")
  } finally {
    setLoading(false)
  }
}


  const question = quizData ? quizData[currentQuestion] : null

  const handleNextQuestion = () => {
    if (quizData && currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      finishQuiz()
    }
  }

  const calculateScore = () => {
    let score = 0
    answers.forEach((userAnswer: string, index: number) => {
      if (userAnswer === quizData![index].correctAnswer) {
        score += 1
      }
    })
    return (score / quizData!.length) * 100
  }

  const finishQuiz = async () => {
    if (!quizData) return
    const finalScore = calculateScore()
    setLoadingQuizResult(true)
    try {
      const result = await storeQuizQuestions(quizData, answers, finalScore)
      setResultData(result)
      toast.success("Quiz Completed Successfully")
      setShowResult(true)
    } catch (error: any) {
      console.log("Error storing quiz result", error.message)
      toast.error("Error saving your quiz result")
    } finally {
      setLoadingQuizResult(false)
    }
  }

  const handleAnswer = (answer: any) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  // UI rendering
  if (loading) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />
  }

  if (resultData) {
    return <QuizResult result={resultData} startNewQuiz={startNewQuiz} />
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
    )
  }

  return (
    <div className="w-full">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>
            Question {currentQuestion + 1} of {quizData.length}
          </CardTitle>
          <CardDescription>{question?.question}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            onValueChange={handleAnswer}
            value={answers[currentQuestion]}
            className="space-y-2"
          >
            {question?.options.map((option: string, index: number) => (
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
            onClick={handleNextQuestion}
            className="w-full"
          >
            {loadingQuizResult ? (
              <BarLoader className="mt-4" width={"100%"} color="gray" />
            ) : currentQuestion < quizData.length - 1 ? (
              "Next Question"
            ) : (
              "Finish Quiz"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default QuizDashboard
