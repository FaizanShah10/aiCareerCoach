"use client"

import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import QuizResult from "../mock/_component/QuizResult" // Import QuizResult component

const QuizList = ({ assessments }: any) => {
  const router = useRouter()
  const [selectedQuiz, setSelectedQuiz] = useState<null | any>(null)

  return (
    <div className="mt-8">
      <h2 className="grdient-title text-2xl">
        <div>
          <Card>
            <div className="flex lg:flex-row md:flex-row flex-col lg:mb-0 md:mb-0 mb-6 items-center justify-between">
              <CardHeader>
                <CardTitle>Recent Quizzes</CardTitle>
                <CardDescription>You can view your quiz performance history</CardDescription>
              </CardHeader>
              <Button className="mr-6" onClick={() => router.push('/mock-test/mock')}>
                Start New Quiz
              </Button>
            </div>
            <CardContent className="space-y-4">
              {assessments.map((assessment: any, index: number) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg" onClick={() => setSelectedQuiz(assessment)}>
                  <CardHeader>
                    <CardTitle>Quiz {index + 1}</CardTitle>
                    <CardDescription>
                      <div>
                        <p>Score: {assessment.quizScore}%</p>
                        <p>Date: {format(new Date(assessment.createdAt), "MM-dd")}</p>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">
                      Improvement Tip: <span className="text-sm">{assessment.improvementTip}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Quiz Result Dialog */}
          <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
            <DialogContent className="lg:h-[80vh] md:h-[80vh] h-[70vh] lg:w-[60vw] md:w-[60vw] w-[80vw] overflow-y-auto text-sm">
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
              <QuizResult
                result={selectedQuiz}
                hideStartNew
                onStartNew={() => router.push("/interview/mock")}
              />
            </DialogContent>
          </Dialog>
        </div>
      </h2>
    </div>
  )
}

export default QuizList
