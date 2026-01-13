"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import QuizResult from "../mock/_component/QuizResult";
import { Assessment } from "@/types/assessment";

/* ======================
   Types
====================== */



type QuizListProps = {
  assessments: Assessment[];
};

/* ======================
   Component
====================== */

const QuizList = ({ assessments }: QuizListProps) => {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState<Assessment | null>(null);

  return (
    <div className="mt-8">
      <Card>
        <div className="flex lg:flex-row md:flex-row flex-col mb-6 items-center justify-between">
          <CardHeader>
            <CardTitle>Recent Quizzes</CardTitle>
            <CardDescription>
              You can view your quiz performance history
            </CardDescription>
          </CardHeader>

          <Button className="mr-6" onClick={() => router.push("/mock-test/mock")}>
            Start New Quiz
          </Button>
        </div>

        <CardContent className="space-y-4">
          {assessments.map((assessment, index) => (
            <Card
              key={assessment.id}
              className="cursor-pointer hover:shadow-lg"
              onClick={() => setSelectedQuiz(assessment)}
            >
              <CardHeader>
                <CardTitle>Quiz {index + 1}</CardTitle>
                <CardDescription>
                  <p>Score: {assessment.quizScore}%</p>
                  <p>
                    Date:{" "}
                    {format(new Date(assessment.createdAt), "MM-dd")}
                  </p>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-lg font-semibold">
                  Improvement Tip:{" "}
                  <span className="text-sm">
                    {assessment.improvementTip ?? "No improvement tip available"}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Quiz Result Dialog */}
      <Dialog
        open={Boolean(selectedQuiz)}
        onOpenChange={() => setSelectedQuiz(null)}
      >
        <DialogContent className="lg:h-[80vh] md:h-[80vh] h-[70vh] lg:w-[60vw] md:w-[60vw] w-[80vw] overflow-y-auto text-sm">
          <DialogHeader>
            <DialogTitle />
          </DialogHeader>

          {selectedQuiz && (
            <QuizResult
              result={{
                quizScore: selectedQuiz.quizScore,
                improvementTip: selectedQuiz.improvementTip,
                questions: selectedQuiz.questions.map((q) => ({
                  question: q.question,
                  options: q.options,
                  userAnswer: q.userAnswer ?? "Not answered",
                  correctAnswer: q.correctAnswer,
                  explanation: q.explanation ?? "No explanation provided",
                  isCorrect: q.isCorrect ?? false,
                })),
              }}
              hideStartNew
              onStartNew={() => router.push("/interview/mock")}
            />
          )}

        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizList;
