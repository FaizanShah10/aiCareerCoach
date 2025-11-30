import { getAssessment } from "../../../../actions/interview"
import PerformaceChart from "./_components/PerformaceChart"
import QuizList from "./_components/QuizList"
import StatsCards from "./_components/StatsCards"

const InterviewPage = async () => {

  const assessments = await getAssessment()

  return (
    <div className="mt-20 lg:px-24 md:px-18 px-4 min-h-screen">
      
        <StatsCards assessments={assessments}/>
        <PerformaceChart assessments={assessments}/>
        <QuizList assessments={assessments}/>
      
    </div>
    
  )
}

export default InterviewPage