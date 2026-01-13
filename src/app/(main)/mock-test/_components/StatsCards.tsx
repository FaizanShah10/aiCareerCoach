import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, Target, Trophy } from "lucide-react";

/* ======================
   Types
====================== */

type Question = {
  id: string;
  // extend if needed
};

type Assessment = {
  quizScore: number;
  questions: Question[];
  createdAt: string | Date;
};

type StatsCardsProps = {
  assessments: Assessment[];
};

/* ======================
   Component
====================== */

const StatsCards = ({ assessments }: StatsCardsProps) => {
  const averageScore =
    assessments.length === 0
      ? 0
      : (
          assessments.reduce(
            (acc, assessment) => acc + assessment.quizScore,
            0
          ) / assessments.length
        ).toFixed(1);

  const latestAssessment = assessments.length > 0 ? assessments[0] : null;

  const totalQuestionsAttempted = assessments.reduce(
    (acc, assessment) => acc + assessment.questions.length,
    0
  );

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
      {/* Average Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Average Score</CardTitle>
          <Trophy className="w-4 h-4" />
        </CardHeader>
        <CardContent>
          <h2 className="pb-4">{averageScore}%</h2>
          <p className="text-xs text-gray-400">Across all quizzes</p>
        </CardContent>
      </Card>

      {/* Questions Practiced */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Questions Practiced</CardTitle>
          <Brain className="w-4 h-4" />
        </CardHeader>
        <CardContent>
          <h2 className="pb-4">{totalQuestionsAttempted}</h2>
          <p className="text-xs text-gray-400">All-time questions</p>
        </CardContent>
      </Card>

      {/* Latest Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Latest Score</CardTitle>
          <Target className="w-4 h-4" />
        </CardHeader>
        <CardContent>
          <h2 className="pb-4">
            {latestAssessment
              ? `${latestAssessment.quizScore.toFixed(1)}%`
              : "0%"}
          </h2>
          <p className="text-xs text-gray-400">Most recent quiz</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
