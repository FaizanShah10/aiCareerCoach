import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Brain, Target, Trophy } from "lucide-react";



const StatsCards = ({assessments}: any) => {


 
  const getAverageScore = () => {
    if(assessments.length === 0) return 0
    const averageScore = assessments.reduce(
      (acc: number, assessment: any) => acc + assessment.quizScore, 
      0
    ) / assessments.length;
    return averageScore.toFixed(1);
  }
  
  const getLatestAssessment = () => {
    if (!assessments?.length) return null;
    return assessments[0];
  }

  const getTotalQuestionsAttempted = () => {
    if (!assessments?.length) return 0;
    const totalQuestionsAttempted = assessments.reduce(
      (acc: number, assessment: any) => acc + assessment.questions.length, 0);
    return totalQuestionsAttempted;
  }

  
  return (
    <div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-4">
        {/* Average Score */}
        <Card>
          <CardHeader className="flex items-center flex-row justify-between space-y-0 pb-2">
            <CardTitle>Average Score</CardTitle>
            <Trophy className="w-4 h-4"/>
          </CardHeader>
          <CardContent>
            <h2 className="pb-4">{getAverageScore()}%</h2>
            <p className="text-xs text-gray-400">Across All Platforms</p>
          </CardContent>
        </Card>

        {/* Questions Practiced */}
        <Card>
          <CardHeader className="flex items-center flex-row justify-between space-y-0 pb-2">
            <CardTitle>Questions Practiced</CardTitle>
            <Brain className="w-4 h-4"/>
          </CardHeader>
          <CardContent>
            <h2 className="pb-4">{getTotalQuestionsAttempted()}</h2>
            <p className="text-xs text-gray-400">All time questions</p>
          </CardContent>
        </Card>

        {/* Latest Score */}
        <Card>
          <CardHeader className="flex items-center flex-row justify-between space-y-0 pb-2">
            <CardTitle>Latest Score</CardTitle>
            <Target className="w-4 h-4"/>
          </CardHeader>
          <CardContent>
          <h2 className="pb-4">
            {getLatestAssessment() ? getLatestAssessment()?.quizScore.toFixed(1) + "%" : "0%"}
          </h2>
            <p className="text-xs text-gray-400">Recent Quiz Score</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StatsCards