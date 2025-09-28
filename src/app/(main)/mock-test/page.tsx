import { getAssessment } from "../../../../actions/interview"
import useFetch from "../../../../hooks/useFetch"
import PerformaceChart from "./_components/PerformaceChart"
import QuizList from "./_components/QuizList"
import StatsCards from "./_components/StatsCards"

const InterviewPage = async () => {
  // getAssessment()

  const assessments = await getAssessment()
  // console.log(assessments)

  return (
    <div className="mt-20 lg:px-24 md:px-18 px-4 min-h-screen">
      <div>
        <StatsCards assessments={assessments}/>
        <PerformaceChart assessments={assessments}/>
        <QuizList assessments={assessments}/>
      </div>
    </div>
    
  )
}

export default InterviewPage